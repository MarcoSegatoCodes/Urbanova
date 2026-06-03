import React from "react";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import type { AlertItem } from "../../types/homepage.ts";

interface LiveAlertsWidgetProps {
  data?: AlertItem[];
}

export const LiveAlertsWidget: React.FC<LiveAlertsWidgetProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No active alerts.
      </Typography>
    );
  }

  return (
    <List disablePadding sx={{ maxHeight: 150, overflow: "auto" }}>
      {data.map((alert) => (
        <ListItem
          key={alert.id}
          disablePadding
          sx={{ py: 0.5, borderBottom: "1px solid #eee" }}
        >
          <ListItemIcon sx={{ minWidth: 35 }}>
            {alert.severity === "critical" ? (
              <ErrorIcon color="error" fontSize="small" />
            ) : alert.severity === "warning" ? (
              <WarningIcon color="warning" fontSize="small" />
            ) : (
              <CheckCircleIcon color="info" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body2">{alert.message}</Typography>}
          />
        </ListItem>
      ))}
    </List>
  );
};
