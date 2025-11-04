
import { Snackbar, Alert } from "@mui/material";
import { useEffect } from "react";


type Props = {
  open: boolean;                 
  onClose: () => void;          
  message: string;               
  severity?: "success" | "error" | "info" | "warning"; 
  autoHideMs?: number;           
};

export default function AlertSnackbar({
  open,
  onClose,
  message,
  severity = "success",
  autoHideMs = 2500,
}: Props) {
  
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(id);
  }, [open, autoHideMs, onClose]);

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // canto inferior direito
    >
      <Alert onClose={onClose} severity={severity} variant="filled" elevation={3}>
        {message}
      </Alert>
    </Snackbar>
  );
}

