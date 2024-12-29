import React, { useState } from "react";
import { Bar } from "../../../../shared/types/bar";
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItemText,
  Pagination,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./BarsList.module.scss";

interface BarsListProps {
  bars: Bar[];
  selectedBar: Bar | undefined;
  setSelectedBar: (bar: Bar | undefined) => void;
}

const BarsList: React.FC<BarsListProps> = ({
  bars,
  selectedBar,
  setSelectedBar,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
      const response = await fetch("https://pionta.onrender.com/api/price", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barId, pintId, price }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete price");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card variant="outlined" className={`mt-2 ${styles.card}`}>
        <CardContent>
          <Autocomplete
            className="mt-1"
            options={bars}
            getOptionLabel={(option) => option.name}
            value={selectedBar || null}
            onChange={(event, newValue) => {
              setSelectedBar(newValue ?? undefined);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select a Bar" />
            )}
          />
          <List>
            {currentItems?.map((pintPrice, index) => (
              <ListItemText key={index}>
                <div className={styles.listItem}>
                  <div className={styles.listItemContent}>
                    <span>{pintPrice.name}</span>
                  </div>
                  <span className={styles.price}>
                    £{pintPrice.price.toFixed(2)}
                  </span>
                  <IconButton
                    onClick={() =>
                      handleDeletePint(
                        selectedBar?.id || 0,
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
          <Box className={styles.paginationBox}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarsList;
