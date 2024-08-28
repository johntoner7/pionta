import React, { useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { PintsContext } from "../PintsContext";
import { Avatar, CardHeader, IconButton, Chip, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./PintLogsFeed.module.scss";
const PintLogsFeed: React.FC = () => {
  const context = useContext(PintsContext);
  if (!context) {
    return null;
  }
  const { pintLogs, setSuccess, setError } = context;
  const formatDate = (date: Date) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-GB", timeOptions);
    return `${formattedTime} on ${formattedDate}`;
  };

  const handleDelete = async (logId: number) => {
    try {
      const response = await fetch("http://localhost:8080/api/log", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete log");
      }

      setSuccess("Pint log was deleted successfully.");
    } catch (error) {
      setError("Failed to delete pint log.");
    }
  };

  return (
    <div className={styles.pintLogsFeed}>
      {pintLogs.map((log) => (
        <Card key={log.id} className={styles.pintLog} variant="outlined">
          <CardHeader
            avatar={<Avatar aria-label="user-avatar">JT</Avatar>}
            action={
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(log.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
            title="John Toner"
            subheader={formatDate(new Date(log.createdAt!))}
          />
          <CardContent>
            <div className={styles.pintLogContent}>
              <Chip label={log.pintName} color="primary" />
              <Typography variant="body2" component="span">
                at
              </Typography>
              <Chip label={log.barName} color="primary" />
            </div>
            {log.description && (
              <Typography
                variant="body2"
                color="textPrimary"
                className={styles.pintLogDescription}
              >
                {log.description}
              </Typography>
            )}
            {log.rating && (
              <Typography
                variant="body2"
                color="textSecondary"
                className={styles.pintLogRating}
              >
                Rating: {log.rating}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PintLogsFeed;
