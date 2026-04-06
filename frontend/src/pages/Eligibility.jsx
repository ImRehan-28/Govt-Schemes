import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button, Grid,
  CircularProgress, Alert, MenuItem, Paper,
} from "@mui/material";
import { getEligibleSchemes } from "../api/schemes";
import SchemeCard from "../components/SchemeCard";

const categories = ["Farmer", "Student", "Women", "Senior Citizen", "General", "Health", "Housing"];
const states = ["India", "AP", "UP", "MH", "KA", "TN", "RJ", "DL", "GJ", "WB"];
const genders = ["Male", "Female", "All"];

const Eligibility = () => {
  const [form, setForm] = useState({ category: "", state: "", age: "", income: "", gender: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const params = {
        category: form.category,
        state: form.state,
        ...(form.age && { age: Number(form.age) }),
        ...(form.income && { income: Number(form.income) }),
        ...(form.gender && { gender: form.gender }),
      };
      const res = await getEligibleSchemes(params);
      setResults(res.data);
    } catch {
      setError("Failed to fetch eligible schemes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#1a237e", color: "white", py: { xs: 4, md: 6 }, px: 2, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.6rem", md: "2.5rem" } }}>
          Check Eligibility
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
          Find schemes you qualify for based on your profile
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth required label="Category" name="category"
                  value={form.category} onChange={handleChange}>
                  {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth required label="State" name="state"
                  value={form.state} onChange={handleChange}>
                  {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Age (optional)" name="age" type="number"
                  value={form.age} onChange={handleChange} inputProps={{ min: 0 }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Annual Income ₹ (optional)" name="income" type="number"
                  value={form.income} onChange={handleChange} inputProps={{ min: 0 }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Gender (optional)" name="gender"
                  value={form.gender} onChange={handleChange}>
                  <MenuItem value="">Any</MenuItem>
                  {genders.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large" fullWidth
                  sx={{ bgcolor: "#1a237e" }} disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Find Eligible Schemes"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {searched && !loading && results.length === 0 && (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            No eligible schemes found for your profile.
          </Typography>
        )}

        <Grid container spacing={3}>
          {results.map((scheme) => (
            <Grid item xs={12} sm={6} key={scheme.id}>
              <SchemeCard scheme={scheme} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Eligibility;
