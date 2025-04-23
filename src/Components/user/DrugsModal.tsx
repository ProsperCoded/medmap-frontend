import React from "react";
import { Modal, Box, Typography, Button, Divider, Stack } from "@mui/material";

interface DrugData {
  name: string;
  description: string;
  composition: string;
  manufacturer: string;
  imageUrl: string;
  price: number;
  stocks: number;
  expiryDate: string;
  uses: string;
  sideEffects: string[];
  pharmacy: {
    name: string;
    address: string;
  };
}

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  drug: DrugData | null;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const DrugDetailsModal: React.FC<ModalProps> = ({
  open,
  handleClose,
  drug,
}) => {
  if (!drug) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {drug.name} - {drug.pharmacy.name}
        </Typography>

        <img
          src={drug.imageUrl}
          alt={drug.name}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        <Stack spacing={1}>
          <Typography>
            <strong>Description:</strong> {drug.description}
          </Typography>
          <Typography>
            <strong>Manufacturer:</strong> {drug.manufacturer}
          </Typography>
          <Typography>
            <strong>Price:</strong> ₦{drug.price.toLocaleString()}
          </Typography>
          <Typography>
            <strong>Composition:</strong> {drug.composition}
          </Typography>
          <Typography>
            <strong>Uses:</strong> {drug.uses}
          </Typography>
          <Typography>
            <strong>Side Effects:</strong> {drug.sideEffects.join(", ")}
          </Typography>
          <Typography>
            <strong>Expiry Date:</strong>{" "}
            {new Date(drug.expiryDate).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Stock:</strong> {drug.stocks} units
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>
            <strong>Pharmacy Address:</strong> {drug.pharmacy.address}
          </Typography>
        </Stack>

        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "#22c3dd",
            "&:hover": { bgcolor: "#1da8b8" },
            borderRadius: 2,
          }}
          fullWidth
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default DrugDetailsModal;
