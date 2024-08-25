import React, { useState, useMemo, useContext } from "react";
import { PintsContext, PintsContextProps } from "../../../PintsContext";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItemText,
  Pagination,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import styles from "./Filters.module.scss"; // Import the SCSS module

const Filters: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const context = useContext(PintsContext);
  const {
    markers,
    selectedMarker,
    setSelectedMarker,
    selectedPint,
    handleFilterChange,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    mostExpensivePint,
    walkingDistances,
    maxDistance,
    setMaxDistance,
    pintLogs,
  } = context as PintsContextProps;
  const itemsPerPage = 9;

  const totalPages = selectedMarker
    ? Math.ceil(selectedMarker.pintPrices.length / itemsPerPage)
    : 0;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = selectedMarker?.pintPrices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDeletePint = async (
    barId: number,
    pintId: number,
    price: number
  ) => {
    try {
      const response = await fetch("http://localhost:8080/api/price", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barId, pintId, price }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete price");
      }

      alert("Price deleted successfully");
    } catch (error) {
      console.error("Error deleting price:", error);
      alert("Failed to delete price");
    }
  };

  const allPints: string[] = useMemo(() => {
    return markers.reduce((acc: string[], marker) => {
      marker.pintPrices.forEach((pintPrice) => {
        if (!acc.includes(pintPrice.name)) {
          acc.push(pintPrice.name);
        }
      });
      return acc;
    }, []);
  }, [markers]);

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

  const filteredMarkers = useMemo(() => {
    return markers.filter((marker) => {
      const distance = walkingDistances.find(
        (distance) => distance.barId === marker.id
      )?.distance;
      return distance !== undefined && distance <= maxDistance;
    });
  }, [markers, walkingDistances, maxDistance]);

  const aggregatePintRatings = () => {
    const ratingsMap = new Map<string, { [pint: string]: number[] }>();

    pintLogs.forEach((log) => {
      if (log.rating !== undefined && log.rating !== null) {
        if (!ratingsMap.has(log.barName)) {
          ratingsMap.set(log.barName, {});
        }
        const barRatings = ratingsMap.get(log.barName)!;
        if (!barRatings[log.pintName]) {
          barRatings[log.pintName] = [];
        }
        barRatings[log.pintName].push(log.rating);
      }
    });

    const aggregatedRatings = Array.from(ratingsMap.entries()).map(
      ([bar, pintRatings]) => ({
        bar,
        ratings: Object.entries(pintRatings).map(([pint, ratings]) => ({
          pint,
          averageRating:
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
        })),
      })
    );

    return aggregatedRatings;
  };

  const aggregatedRatings = aggregatePintRatings();

  const getRating = (bar: string, pint: string) => {
    const barRatings = aggregatedRatings.find((rating) => rating.bar === bar);
    if (barRatings) {
      const pintRating = barRatings.ratings.find(
        (rating) => rating.pint === pint
      );
      if (pintRating) {
        return pintRating.averageRating;
      }
    }
    return null;
  };

  return (
    <Card variant="outlined" className={styles.card}>
      <CardContent>
        <Typography variant="h6">Filters</Typography>
        <Autocomplete
          options={pintOptions}
          getOptionLabel={(option) => option.label}
          onChange={handlePintChange}
          value={
            selectedPint ? { value: selectedPint, label: selectedPint } : null
          }
          renderInput={(params) => <TextField {...params} label="Pint" />}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          clearOnEscape
          className="mt-2"
        />
        <Typography variant="h6" className="mt-2">
          Price Range
        </Typography>
        <Box padding={1}>
          <Slider
            value={[minPrice, maxPrice]}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={0.0}
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
        <Typography variant="h6">Price List</Typography>
        <Autocomplete
          className="mt-1"
          options={filteredMarkers}
          getOptionLabel={(option) => option.name}
          value={selectedMarker || null}
          onChange={(event, newValue) => {
            setSelectedMarker(newValue ?? undefined);
          }}
          renderInput={(params) => <TextField {...params} label="Bar" />}
        />
        <List>
          {currentItems?.map((pintPrice, index) => (
            <ListItemText key={index}>
              <div className={styles.listItem}>
                <div className={styles.listItemContent}>
                  <span>{pintPrice?.name ?? "Unknown"} </span>
                  <span>
                    <StarRating
                      rating={
                        getRating(
                          selectedMarker?.name ?? "",
                          pintPrice?.name ?? ""
                        ) ?? 0
                      }
                    />
                  </span>
                </div>
                <span className={styles.price}>
                  £{pintPrice.price.toFixed(2)}
                </span>
                <IconButton
                  onClick={() =>
                    handleDeletePint(
                      selectedMarker?.id || 0,
                      pintPrice.id,
                      pintPrice.price
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
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
      </CardContent>
    </Card>
  );
};

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  if (rating == null || rating === 0) {
    return null;
  }

  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? (
        <StarIcon color="primary" key={i} />
      ) : (
        <StarBorderIcon color="primary" key={i} />
      )
    );
  }
  return <div>{stars}</div>;
};

export default Filters;
