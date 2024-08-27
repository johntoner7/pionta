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
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface PintsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pintLogs: PintLog[];
  setPintLogs: (logs: PintLog[]) => void;
  selectedPint: string | null;
  setSelectedPint: (pint: string | null) => void;
  handleFilterChange: (filter: { value: string } | null) => void;
  bars: Bar[];
  setBars: (bars: Bar[]) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  mostExpensivePint: number;
  leastExpensivePint: number;
  handleLogPint: (pint: PintLogRequest) => void;
  filteredBarList: Bar[];
  selectedBar: Bar | undefined;
  setSelectedBar: (bar: Bar | undefined) => void;
  getPintPrice: (bar: Bar) => string;
  walkingDistances: BarDistance[];
  setWalkingDistances: (distances: BarDistance[]) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  showAllBars: boolean;
  setShowAllBars: (showAllBars: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  success: string | null;
  setSuccess: (success: string | null) => void;
}

export interface BarDistance {
  barId: number;
  distance: number;
}

const PintsContext = createContext<PintsContextProps | undefined>(undefined);
const PintsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [pintLogs, setPintLogs] = useState<PintLog[]>([]);
  const [selectedBar, setSelectedBar] = useState<Bar>();
  const [selectedPint, setSelectedPint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("add");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10);
  const [mostExpensivePint, setMostExpensivePint] = useState<number>(0);
  const [leastExpensivePint, setLeastExpensivePint] = useState<number>(0);
  const [walkingDistances, setWalkingDistances] = useState<BarDistance[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [showAllBars, setShowAllBars] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/bar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBars(data.bars);
        setMostExpensivePint(
          data.bars
            .map((bar: { pintPrices: PintPrice[] }) =>
              bar.pintPrices.map((pint) => pint.price)
            )
            .flat()
            .reduce((a: number, b: number) => Math.max(a, b))
        );
        setLeastExpensivePint(
          data.bars
            .map((bar: { pintPrices: PintPrice[] }) =>
              bar.pintPrices.map((pint) => pint.price)
            )
            .flat()
            .reduce((a: number, b: number) => Math.min(a, b))
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "newBar") {
        fetch("http://localhost:8080/api/bar")
          .then((response) => response.json())
          .then((data) => setBars(data.bars))
          .catch((error) => console.error("Error fetching bars:", error));
      }
    };

    return () => {
      socket.close();
    };
  }, [setBars]);

  useEffect(() => {
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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFilterChange = (selectedOption: { value: string } | null) => {
    setSelectedPint(selectedOption ? selectedOption.value : null);
  };

  const filteredBarList = useMemo(() => {
    return bars.filter((bar) => {
      if (walkingDistances.length > 0) {
        // filter based on distance from user
        const distance = walkingDistances.find(
          (distance) => distance.barId === bar.id
        )?.distance;
        if (distance === undefined || distance > maxDistance) {
          return false;
        }
      }

      if (selectedPint) {
        // Check if the selected pint is within the price range
        return bar.pintPrices.some(
          (pintPrice) =>
            pintPrice.name === selectedPint &&
            pintPrice.price >= minPrice &&
            pintPrice.price <= maxPrice
        );
      } else {
        // Check if any pint is within the price range
        return (
          (showAllBars && bar.pintPrices.length === 0) ||
          bar.pintPrices.some(
            (pintPrice) =>
              pintPrice.price >= minPrice && pintPrice.price <= maxPrice
          )
        );
      }
    });
  }, [
    bars,
    walkingDistances,
    maxDistance,
    selectedPint,
    minPrice,
    maxPrice,
    showAllBars,
  ]);

  const getPintPrice = (bar: Bar) => {
    // Check if there is a filtered pint price
    const filteredPint = bar.pintPrices.find(
      (pint) => pint.name === selectedPint
    );
    if (filteredPint?.price) {
      return filteredPint.price.toFixed(2);
    }

    // Filter pint prices based on min and max price if they are set
    const filteredPrices: PintPrice[] = bar.pintPrices.filter((pint) => {
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
      setSuccess("Your pint was logged successfully.");
    } catch (error) {
      setError("There was an error logging your pint.");
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
        bars,
        setBars,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        mostExpensivePint,
        leastExpensivePint,
        handleLogPint,
        filteredBarList,
        selectedBar,
        setSelectedBar,
        getPintPrice,
        walkingDistances,
        setWalkingDistances,
        maxDistance,
        setMaxDistance,
        showAllBars,
        setShowAllBars,
        error,
        setError,
        success,
        setSuccess,
      }}
    >
      {error && (
        <Alert
          severity="error"
          action={
            <IconButton color="inherit" size="small">
              <CloseIcon />
            </IconButton>
          }
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          action={
            <IconButton color="inherit" size="small">
              <CloseIcon />
            </IconButton>
          }
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
      {children}
    </PintsContext.Provider>
  );
};

export { PintsContext, PintsProvider };
