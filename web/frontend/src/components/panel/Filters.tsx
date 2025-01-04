import React, { useState, useMemo, useContext } from "react";
import { PintsContext, PintsContextProps } from "../../PintsContext";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItemText,
  Pagination,
  Slider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./Filters.module.scss";

const Filters: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);
  const context = useContext(PintsContext);
  const {
    bars,
    selectedBar,
    setSelectedBar,
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
    filteredBarList,
    showAllBars,
    setShowAllBars,
    setError,
    setSuccess,
  } = context as PintsContextProps;
  const itemsPerPage = 15;

  const totalPages = selectedBar
    ? Math.ceil(selectedBar.pintPrices.length / itemsPerPage)
    : 0;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = selectedBar?.pintPrices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDeletePint = async (
    barId: number,
    pintId: number,
    price: number
  ) => {
    try {
      const response = await fetch("http://localhost:3000/api/price", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barId, pintId, price }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete price");
      }
      setSuccess("The price of the pint was deleted successfully.");
    } catch (error) {
      setError("Failed to delete price");
    }
  };

  const allPints: string[] = useMemo(() => {
    return bars.reduce((acc: string[], marker) => {
      marker.pintPrices.forEach((pintPrice) => {
        if (!acc.includes(pintPrice.name)) {
          acc.push(pintPrice.name);
          acc.sort();
        }
      });
      return acc;
    }, []);
  }, [bars]);

  const pintOptions = allPints.map((pintName) => ({
    value: pintName,
    label: pintName,
  }));

  const handlePintChange = (
    event: React.SyntheticEvent,
    value: { value: string } | null
  ) => {
    handleFilterChange(value);
  };

  const handleSliderChange = (event: Event, values: number | number[]) => {
    const [newMinPrice, newMaxPrice] = values as number[];
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
  };

  const handleDistanceChange = (event: Event, value: number | number[]) => {
    setMaxDistance(value as number);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Card variant="outlined" className={styles.card}>
      <CardContent>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          className={styles.tabs}
        >
          <Tab label="Filter Map" className={styles.tab} />
          <Tab label="Bar Selection" className={styles.tab} />
        </Tabs>
        {tabIndex === 0 && (
          <>
            <Typography variant="h6">Filters</Typography>
            <Autocomplete
              options={pintOptions}
              getOptionLabel={(option) => option.label}
              onChange={handlePintChange}
              value={
                selectedPint
                  ? { value: selectedPint, label: selectedPint }
                  : null
              }
              renderInput={(params) => <TextField {...params} label="Pint" />}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              clearOnEscape
              className="mt-2"
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showAllBars}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setShowAllBars(event.target.checked);
                    }}
                  />
                }
                label="Show bars with no data"
              />
            </FormGroup>
            <Typography variant="h6" className="mt-2">
              Price Range
            </Typography>
            <Box padding={1}>
              <Slider
                value={[minPrice, maxPrice]}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={leastExpensivePint}
                max={mostExpensivePint}
                step={0.05}
                valueLabelFormat={(value) => `£${value.toFixed(2)}`}
              />
            </Box>
            <Typography variant="h6" className="mt-2">
              Distance (km)
            </Typography>
            <Box padding={1}>
              <Slider
                value={maxDistance}
                onChange={handleDistanceChange}
                valueLabelDisplay="auto"
                min={0}
                max={20}
                step={0.5}
                valueLabelFormat={(value) => `${value} km`}
              />
            </Box>
          </>
        )}
        {tabIndex === 1 && (
          <>
            <Typography variant="h6">Price List</Typography>
            <Autocomplete
              className="mt-1"
              options={filteredBarList.filter(
                (marker) => marker.pintPrices.length > 0
              )}
              getOptionLabel={(option) => option.name}
              value={selectedBar || null}
              onChange={(event, newValue) => {
                setSelectedBar(newValue ?? undefined);
              }}
              renderInput={(params) => <TextField {...params} label="Bar" />}
            />
            <List>
              {currentItems?.sort((a,b) => a.name.localeCompare(b.name)).map((pintPrice, index) => (
                <ListItemText key={index}>
                  <div className={styles.listItem}>
                    <div className={styles.listItemContent}>
                      <span>{pintPrice?.name ?? "N/A"} </span>
                    </div>
                    <span className={styles.price}>
                      £{pintPrice.price.toFixed(2)}
                    </span>
                  </div>
                </ListItemText>
              ))}
            </List>
            {currentItems && (
              <Box className={styles.paginationBox}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Filters;
