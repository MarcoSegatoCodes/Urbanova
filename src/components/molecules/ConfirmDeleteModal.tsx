// components/Vehicle/molecules/ConfirmDeleteModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface Props {
  isOpen: boolean;
  vehicleName: string;
  isSoftDelete?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  vehicleName,
  isSoftDelete = true,
  onConfirm,
  onCancel,
  isLoading = false,
}: Props) {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>Delete Vehicle?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isSoftDelete
            ? `This will retire "${vehicleName}" and remove it from active fleet. This action can be undone.`
            : `This will permanently delete "${vehicleName}". This action cannot be undone.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          color="error"
          variant="contained"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
