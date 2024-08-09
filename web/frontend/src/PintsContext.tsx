import React, { createContext, useState, ReactNode, useEffect } from "react";

interface PintsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pintLogs: PintLog[];
  setPintLogs: (logs: PintLog[]) => void;
  selectedPint: string | null;
  setSelectedPint: (pint: string | null) => void;
  handleFilterChange: (filter: { value: string } | null) => void;
  markers: MarkerType[];
  setMarkers: (markers: MarkerType[]) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  mostExpensivePint: number;
  handleLogPint: (pint: PintLog) => void;
  filteredMarkerList: any[];
  selectedMarker: any;
  setSelectedMarker: (marker: any) => void;
  getPintPrice: (marker: MarkerType) => string;
}

export interface PintPrice {
  name: string;
  price: number;
}

export interface MarkerType {
  id: number;
  longitude: number;
  latitude: number;
  name: string;
  description: string;
  pintPrices: PintPrice[];
}

export interface PintLog {
  id: number;
  pintName: string;
  barName: string;
  rating?: number;
  description?: string;
  logDate?: Date;
}

const PintsContext = createContext<PintsContextProps | undefined>(undefined);
const PintsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [pintLogs, setPintLogs] = useState<PintLog[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType>();
  const [selectedPint, setSelectedPint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("add");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10);
  const [mostExpensivePint, setMostExpensivePint] = useState<number>(0);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:8080/api/bars", {
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
            .map((bar: { pintPrices: any[] }) =>
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

  const filteredMarkers = (selectedPint: string) => {
    return markers.filter((marker) => {
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
        return marker.pintPrices.some(
          (pintPrice) =>
            pintPrice.price >= minPrice && pintPrice.price <= maxPrice
        );
      }
    });
  };
  const filteredMarkerList = filteredMarkers(selectedPint ?? "");

  // Define the function to get the minimum pint price
  const getPintPrice = (marker: MarkerType) => {
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

  const handleLogPint = async (log: PintLog) => {
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
      }}
    >
      {children}
    </PintsContext.Provider>
  );
};

export { PintsContext, PintsProvider };
