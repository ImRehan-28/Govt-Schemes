import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Chip, Button, CircularProgress,
  Alert, Divider, Container, Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getSchemeById } from "../api/schemes";

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(`[SchemeDetail] Loading scheme id: ${id}`);
    getSchemeById(id)
      .then((res) => {
        console.log("[SchemeDetail] Scheme loaded:", res.data?.name);
        setScheme(res.data);
      })
      .catch(() => {
        console.error(`[SchemeDetail] Failed to load scheme id: ${id}`);
        setError("Scheme not found or not approved yet.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ bgcolor: "#1a237e", color: "white", p: 3 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
              <Chip label={scheme.category} sx={{ bgcolor: "white", color: "#1a237e" }} size="small" />
              <Chip label={scheme.state} variant="outlined" sx={{ color: "white", borderColor: "white" }} size="small" />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
              {scheme.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.85, mt: 0.5 }}>
              Ministry: {scheme.ministry}
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={700}>Description</Typography>
                <Typography color="text.secondary">{scheme.description}</Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={700}>Eligibility</Typography>
                <Typography color="text.secondary">{scheme.eligibility}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={700}>Benefits</Typography>
                <Typography color="text.secondary">{scheme.benefits}</Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Typography fontWeight={600}>{scheme.category}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">State</Typography>
                <Typography fontWeight={600}>{scheme.state}</Typography>
              </Grid>
            </Grid>

            {scheme.link && (
              <Button
                variant="contained"
                endIcon={<OpenInNewIcon />}
                href={scheme.link}
                target="_blank"
                rel="noreferrer"
                sx={{ mt: 3, bgcolor: "#1a237e" }}
              >
                Visit Official Page
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SchemeDetail;
