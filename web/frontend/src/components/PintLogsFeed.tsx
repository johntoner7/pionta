import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { PintLog } from "../PintsContext"; // Adjust the import path as necessary
import { Avatar, CardHeader, IconButton, Chip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface PintLogsFeedProps {
  pintLogs: PintLog[];
}

const PintLogsFeed: React.FC<PintLogsFeedProps> = ({ pintLogs }) => {
  const formatDate = (date: Date) => {
    console.log(date);
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

  return (
    <div className="pint-logs-feed">
      {pintLogs.map((log) => (
        <Card
          key={log.id}
          className="pint-log"
          variant="outlined"
          style={{ marginBottom: "16px" }}
        >
          <CardHeader
            avatar={<Avatar aria-label="user-avatar">JT</Avatar>}
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="John Toner"
            subheader={formatDate(new Date(log.logDate!))}
          />
          <CardContent>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
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
                style={{ marginTop: "8px" }}
              >
                {log.description}
              </Typography>
            )}
            {log.rating && (
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginTop: "8px" }}
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
