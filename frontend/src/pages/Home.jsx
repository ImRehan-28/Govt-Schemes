import { useEffect, useState } from "react";
import {
  Box, Grid, Typography, CircularProgress, Alert, Pagination,
  Container, TextField, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getAllSchemes, getSchemesWithPagination } from "../api/schemes";
import SchemeCard from "../components/SchemeCard";
import FilterBar from "../components/FilterBar";

const PAGE_SIZE = 6;

const Home = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [usePagination, setUsePagination] = useState(true);

  const fetchPaginated = async (p) => {
    console.log(`[Home] fetchPaginated called - page: ${p}`);
    setLoading(true);
    setError("");
    try {
      const res = await getSchemesWithPagination(p - 1, PAGE_SIZE);
      if (res.data && res.data.length > 0) {
        console.log(`[Home] Paginated schemes loaded - count: ${res.data.length}`);
        setSchemes(res.data);
        setTotalPages(res.data.length < PAGE_SIZE ? p : p + 1);
      } else {
        console.log("[Home] No paginated data, falling back to getAllSchemes");
        const fallback = await getAllSchemes();
        setSchemes(fallback.data || []);
        setTotalPages(1);
      }
    } catch {
      console.warn("[Home] Paginated fetch failed, trying fallback");
      try {
        const fallback = await getAllSchemes();
        setSchemes(fallback.data || []);
      } catch {
        console.error("[Home] Fallback also failed");
        setError("Failed to load schemes. Make sure the backend is running on port 8080.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltered = async (category, state) => {
    console.log(`[Home] fetchFiltered called - category: ${category}, state: ${state}`);
    setLoading(true);
    setError("");
    setUsePagination(false);
    try {
      const res = await getAllSchemes(category, state);
      console.log(`[Home] Filtered schemes loaded - count: ${res.data?.length}`);
      setSchemes(res.data || []);
    } catch {
      console.error("[Home] fetchFiltered failed");
      setError("Failed to load schemes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginated(page);
  }, [page]);

  const handleFilter = (category, state) => {
    console.log(`[Home] Filter applied - category: ${category}, state: ${state}`);
    if (!category && !state) {
      setUsePagination(true);
      setPage(1);
      fetchPaginated(1);
    } else {
      fetchFiltered(category, state);
    }
  };

  const filtered = searchInput
    ? schemes.filter((s) => s.name?.toLowerCase().includes(searchInput.toLowerCase()))
    : schemes;

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh" }}>
      {/* Hero */}
      <Box sx={{ bgcolor: "#1a237e", color: "white", py: { xs: 5, md: 8 }, px: 2, textAlign: "center" }}>
        <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: "1.8rem", md: "3rem" } }}>
          Government Scheme Portal
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, opacity: 0.85, fontSize: { xs: "1rem", md: "1.25rem" } }}>
          Discover schemes you are eligible for
        </Typography>
        <Box sx={{ mt: 3, maxWidth: 500, mx: "auto" }}>
          <TextField
            fullWidth
            placeholder="Quick search schemes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <FilterBar onFilter={handleFilter} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography color="text.secondary" variant="h6">No approved schemes found.</Typography>
            <Typography color="text.secondary" variant="body2" mt={1}>
              Login as admin to add and approve schemes.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" mb={2} color="text.secondary">
              Showing {filtered.length} scheme(s)
            </Typography>
            <Grid container spacing={3}>
              {filtered.map((scheme) => (
                <Grid item xs={12} sm={6} md={4} key={scheme.id}>
                  <SchemeCard scheme={scheme} />
                </Grid>
              ))}
            </Grid>

            {usePagination && totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Home;
