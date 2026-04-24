// components/Vehicle/molecules/VehicleFormField.tsx
import { FormControl, FormHelperText, FormLabel, Box, ReactNode } from '@mui/material';

interface Props {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export default function VehicleFormField({ label, error, required = false, children }: Props) {
  return (
    <FormControl fullWidth error={!!error}>
      <FormLabel sx={{ mb: 1 }}>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </FormLabel>
      {children}
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
