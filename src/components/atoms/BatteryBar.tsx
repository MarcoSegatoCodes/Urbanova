// components/Vehicle/atoms/BatteryBar.tsx
import { Box, LinearProgress, Typography } from '@mui/material';

interface Props {
  level: number;
  size?: 'small' | 'medium' | 'large';
}

export default function BatteryBar({ level, size = 'medium' }: Props) {
  let color: 'error' | 'warning' | 'success' = 'success';
  if (level < 20) color = 'error';
  else if (level < 50) color = 'warning';

  const heights = {
    small: 4,
    medium: 8,
    large: 12,
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ flex: 1, minWidth: 80 }}>
        <LinearProgress
          variant="determinate"
          value={level}
          color={color}
          sx={{ height: heights[size], borderRadius: 1 }}
        />
      </Box>
      <Typography variant="caption" sx={{ minWidth: 30, fontWeight: 'bold' }}>
        {level}%
      </Typography>
    </Box>
  );
}
