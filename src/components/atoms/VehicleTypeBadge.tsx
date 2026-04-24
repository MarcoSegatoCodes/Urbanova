// components/Vehicle/atoms/VehicleTypeBadge.tsx
import { Chip } from "@mui/material";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import type { VehicleType } from "../../types";

interface Props {
  type: VehicleType;
}

const iconMap: Record<string, React.ReactNode> = {
  BIKE: <DirectionsBikeIcon sx={{ fontSize: 18 }} />,
  SCOOTER: <TwoWheelerIcon sx={{ fontSize: 18 }} />,
  CAR: <DirectionsCarIcon sx={{ fontSize: 18 }} />,
  BUS: <DirectionsBusIcon sx={{ fontSize: 18 }} />,
};

const typeConfig: Record<string, { color: any; label: string }> = {
  BIKE: { color: "info", label: "Bike" },
  SCOOTER: { color: "success", label: "Scooter" },
  CAR: { color: "warning", label: "Car" },
  BUS: { color: "error", label: "Bus" },
};

export default function VehicleTypeBadge({ type }: Props) {
  const config = typeConfig[type] || { color: "default", label: type };
  const icon = iconMap[type];

  return (
    <Chip
      icon={icon as any}
      label={config.label}
      color={config.color}
      variant="outlined"
      size="small"
    />
  );
}
