import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button, Grid,
  CircularProgress, Alert, MenuItem, Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchSchemes } from "../api/schemes";
import SchemeCard from "../components/SchemeCard";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    console.log(`[Search] Searching for keyword: "${keyword.trim()}"`);
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await searchSchemes(keyword.trim());
      console.log(`[Search] Results found - count: ${res.data?.length}`);
      setResults(res.data);
    } catch {
      console.error("[Search] Search failed");
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#1a237e", color: "white", py: { xs: 4, md: 6 }, px: 2, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.6rem", md: "2.5rem" } }}>
          Search Schemes
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
          Find government schemes by name
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              fullWidth
              label="Search by scheme name"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              sx={{ bgcolor: "#1a237e", px: 4 }}
              disabled={loading}
            >
              Search
            </Button>
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : searched && results.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            No schemes found for "{keyword}".
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {results.map((scheme) => (
              <Grid item xs={12} sm={6} key={scheme.id}>
                <SchemeCard scheme={scheme} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Search;
