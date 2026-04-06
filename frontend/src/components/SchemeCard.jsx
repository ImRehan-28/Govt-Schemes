import {
  Card, CardContent, CardActions, Typography, Button, Chip, Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SchemeCard = ({ scheme }) => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, flexWrap: "wrap", gap: 1 }}>
          <Chip label={scheme.category} color="primary" size="small" />
          <Chip label={scheme.state} variant="outlined" size="small" />
        </Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {scheme.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {scheme.description?.length > 100
            ? scheme.description.substring(0, 100) + "..."
            : scheme.description}
        </Typography>
        <Typography variant="body2">
          <strong>Ministry:</strong> {scheme.ministry}
        </Typography>
        <Typography variant="body2">
          <strong>Benefits:</strong> {scheme.benefits}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(`/schemes/${scheme.id}`)}
        >
          View Details
        </Button>
        {scheme.link && (
          <Button size="small" href={scheme.link} target="_blank" rel="noreferrer">
            Official Link
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default SchemeCard;
