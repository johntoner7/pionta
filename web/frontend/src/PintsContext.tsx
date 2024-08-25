import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { PintLog, PintLogRequest } from "../../../shared/types/pintLog";
import { Bar } from "../../../shared/types/bar";
import PintPrice from "../../../shared/types/pintPrice";

export interface PintsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pintLogs: PintLog[];
  setPintLogs: (logs: PintLog[]) => void;
  selectedPint: string | null;
  setSelectedPint: (pint: string | null) => void;
  handleFilterChange: (filter: { value: string } | null) => void;
  markers: Bar[];
  setMarkers: (markers: Bar[]) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  mostExpensivePint: number;
  handleLogPint: (pint: PintLogRequest) => void;
  filteredMarkerList: Bar[];
  selectedMarker: Bar | undefined;
  setSelectedMarker: (marker: Bar | undefined) => void;
  getPintPrice: (marker: Bar) => string;
  walkingDistances: BarDistance[];
  setWalkingDistances: (distances: BarDistance[]) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
}

export interface BarDistance {
  barId: number;
  distance: number;
}

const PintsContext = createContext<PintsContextProps | undefined>(undefined);
const PintsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<Bar[]>([]);
  const [pintLogs, setPintLogs] = useState<PintLog[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Bar>();
  const [selectedPint, setSelectedPint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("add");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10);
  const [mostExpensivePint, setMostExpensivePint] = useState<number>(0);
  const [walkingDistances, setWalkingDistances] = useState<BarDistance[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(10);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:8080/api/bar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMarkers(data.bars);
        setMostExpensivePint(
          data.bars
            .map((bar: { pintPrices: PintPrice[] }) =>
              bar.pintPrices.map((pint) => pint.price)
            )
            .flat()
            .reduce((a: number, b: number) => Math.max(a, b))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "newBar") {
        // Fetch the updated list of bars
        fetch("http://localhost:8080/api/bar")
          .then((response) => response.json())
          .then((data) => setMarkers(data.bars))
          .catch((error) => console.error("Error fetching bars:", error));
      }
    };

    return () => {
      socket.close();
    };
  }, [setMarkers]);

  useEffect(() => {
    // Fetch logs from the API
    fetch("http://localhost:8080/api/logs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPintLogs(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFilterChange = (selectedOption: { value: string } | null) => {
    setSelectedPint(selectedOption ? selectedOption.value : null);
  };

  const filteredMarkers = useMemo(() => {
    return markers.filter((marker) => {
      if (walkingDistances.length > 0) {
        // filter based on distance from user
        const distance = walkingDistances.find(
          (distance) => distance.barId === marker.id
        )?.distance;
        if (distance === undefined || distance > maxDistance) {
          console.log(distance);
          return false;
        }
      }

      if (selectedPint) {
        // Check if the selected pint is within the price range
        return marker.pintPrices.some(
          (pintPrice) =>
            pintPrice.name === selectedPint &&
            pintPrice.price >= minPrice &&
            pintPrice.price <= maxPrice
        );
      } else {
        // Check if any pint is within the price range
        return (
          marker.pintPrices.length === 0 ||
          marker.pintPrices.some(
            (pintPrice) =>
              pintPrice.price >= minPrice && pintPrice.price <= maxPrice
          )
        );
      }
    });
  }, [
    markers,
    walkingDistances,
    maxDistance,
    selectedPint,
    minPrice,
    maxPrice,
  ]);

  const filteredMarkerList = filteredMarkers;

  // Define the function to get the minimum pint price
  const getPintPrice = (marker: Bar) => {
    // Check if there is a filtered pint price
    const filteredPint = marker.pintPrices.find(
      (pint) => pint.name === selectedPint
    );
    if (filteredPint?.price) {
      return filteredPint.price.toFixed(2);
    }

    // Filter pint prices based on min and max price if they are set
    const filteredPrices: PintPrice[] = marker.pintPrices.filter((pint) => {
      if (minPrice && maxPrice) {
        return pint.price >= minPrice && pint.price <= maxPrice;
      }
      return true;
    });

    // Calculate the minimum pint price from the filtered prices
    const cheapestPint = filteredPrices.reduce(
      (min, p) => (p.price < min ? p.price : min),
      filteredPrices[0]?.price || 0
    );
    if (cheapestPint) {
      return cheapestPint.toFixed(2);
    } else {
      return "";
    }
  };

  const handleLogPint = async (log: PintLogRequest) => {
    try {
      const response = await fetch("http://localhost:8080/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(log),
      });

      if (!response.ok) {
        throw new Error("Failed to log pint");
      }

      alert("Pint logged successfully");
    } catch (error) {
      console.error("Error logging pint:", error);
      alert("Failed to log pint");
    }
  };

  return (
    <PintsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        pintLogs,
        setPintLogs,
        selectedPint,
        setSelectedPint,
        handleFilterChange,
        markers,
        setMarkers,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        mostExpensivePint,
        handleLogPint,
        filteredMarkerList,
        selectedMarker,
        setSelectedMarker,
        getPintPrice,
        walkingDistances,
        setWalkingDistances,
        maxDistance,
        setMaxDistance,
      }}
    >
      {children}
    </PintsContext.Provider>
  );
};

export { PintsContext, PintsProvider };
