// components/Vehicle/atoms/VehicleTypeBadge.tsx
import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import type { ReactElement } from "react";

import type { VehicleType } from "../../types";

interface Props {
  type: VehicleType;
}

const iconMap: Record<string, ReactElement> = {
  BIKE: <DirectionsBikeIcon sx={{ fontSize: 18 }} />,
  SCOOTER: <TwoWheelerIcon sx={{ fontSize: 18 }} />,
  CAR: <DirectionsCarIcon sx={{ fontSize: 18 }} />,
  ELECTRIC_CAR: <DirectionsCarIcon sx={{ fontSize: 18 }} />,
  BUS: <DirectionsBusIcon sx={{ fontSize: 18 }} />,
  ELECTRIC_BUS: <DirectionsBusIcon sx={{ fontSize: 18 }} />,
};

const typeConfig: Record<string, { color: ChipProps["color"]; label: string }> = {
  BIKE: { color: "info", label: "Bike" },
  SCOOTER: { color: "success", label: "Scooter" },
  CAR: { color: "warning", label: "Car" },
  ELECTRIC_CAR: { color: "success", label: "Electric Car" },
  BUS: { color: "error", label: "Bus" },
  ELECTRIC_BUS: { color: "secondary", label: "Electric Bus" },
};

const formatEnumLabel = (raw: string): string =>
  raw
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

export default function VehicleTypeBadge({ type }: Props) {
  const normalizedType = String(type).trim().toUpperCase();
  const config = typeConfig[normalizedType] || {
    color: "default",
    label: formatEnumLabel(normalizedType),
  };
  const icon = iconMap[normalizedType];

  return (
    <Chip
      {...(icon ? { icon } : {})}
      label={config.label}
      color={config.color}
      variant="outlined"
      size="small"
      sx={{
        height: 26,
        fontWeight: 500,
        "& .MuiChip-label": {
          px: 1,
          lineHeight: "24px",
        },
        "& .MuiChip-icon": {
          ml: 0.5,
        },
      }}
    />
  );
}
