import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bar, PintPrice } from './types/bar';

export interface PintLog {
  id: number;
  barId: number;
  barName: string;
  pintName: string;
  price: number;
  rating?: number;
  description?: string;
  timestamp: Date;
  createdAt: string;
}

export interface PintsContextType {
  // Core data
  bars: Bar[];
  walkingDistances: { barId: number; distance: number }[];
  setWalkingDistances: (distances: { barId: number; distance: number }[]) => void;
  filteredBarList: Bar[];
  
  // Bar selection
  selectedBar: Bar | null;
  setSelectedBar: (bar: Bar | null) => void;
  
  // Filtering
  selectedPint: string | null;
  handleFilterChange: (value: { value: string } | null) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  mostExpensivePint: number;
  leastExpensivePint: number;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  showAllBars: boolean;
  setShowAllBars: (show: boolean) => void;
  
  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Actions
  getPintPrice: (barId: number, pintName: string) => PintPrice | undefined;
  handleLogPint: (barId: number, pintName: string, price: number, rating?: number, description?: string) => void;
  
  // Notifications
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  
  // Logs
  pintLogs: PintLog[];
}

export const PintsContext = createContext<PintsContextType | undefined>(undefined);

export const PintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core data
  const [bars, setBars] = useState<Bar[]>([]);
  const [walkingDistances, setWalkingDistances] = useState<{ barId: number; distance: number }[]>([]);
  
  // Bar selection
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  
  // Filtering
  const [selectedPint, setSelectedPint] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10);
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [showAllBars, setShowAllBars] = useState<boolean>(true);
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>('filter');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [pintLogs, setPintLogs] = useState<PintLog[]>([]);

  // Computed values
  const filteredBarList = bars; // TODO: Implement actual filtering logic
  const mostExpensivePint = Math.max(...bars.flatMap(bar => bar.pintPrices.map(p => p.price)), 0);
  const leastExpensivePint = Math.min(...bars.flatMap(bar => bar.pintPrices.map(p => p.price)), 0);

  const getPintPrice = (barId: number, pintName: string): PintPrice | undefined => {
    const bar = bars.find(b => b.id === barId);
    return bar?.pintPrices.find(p => p.name === pintName);
  };

  const handleFilterChange = (value: { value: string } | null) => {
    setSelectedPint(value?.value || null);
  };

  const handleLogPint = (barId: number, pintName: string, price: number, rating?: number, description?: string) => {
    const newLog: PintLog = {
      id: Date.now(), // Using timestamp as temporary ID
      barId,
      barName: selectedBar?.name || '',
      pintName,
      price,
      rating,
      description,
      timestamp: new Date(),
      createdAt: new Date().toISOString()
    };
    setPintLogs(prev => [...prev, newLog]);
    // TODO: Implement API call to save pint log
  };

  useEffect(() => {
    // TODO: Fetch bars from API
    const fetchBars = async () => {
      try {
        const response = await fetch('/api/bars');
        const data = await response.json();
        setBars(data);
      } catch (error) {
        console.error('Failed to fetch bars:', error);
        setError('Failed to fetch bars');
      }
    };

    fetchBars();
  }, []);

  return (
    <PintsContext.Provider value={{ 
      // Core data
      bars,
      walkingDistances,
      setWalkingDistances,
      filteredBarList,
      
      // Bar selection
      selectedBar,
      setSelectedBar,
      
      // Filtering
      selectedPint,
      handleFilterChange,
      minPrice,
      setMinPrice,
      maxPrice,
      setMaxPrice,
      mostExpensivePint,
      leastExpensivePint,
      maxDistance,
      setMaxDistance,
      showAllBars,
      setShowAllBars,
      
      // UI state
      activeTab,
      setActiveTab,
      
      // Actions
      getPintPrice,
      handleLogPint,
      
      // Notifications
      setError,
      setSuccess,
      
      // Logs
      pintLogs
    }}>
      {children}
    </PintsContext.Provider>
  );
};

export const usePintsContext = () => {
  const context = useContext(PintsContext);
  if (context === undefined) {
    throw new Error('usePintsContext must be used within a PintsProvider');
  }
  return context;
};
