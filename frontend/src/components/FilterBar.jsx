import { useState } from "react";
import {
  Box, TextField, MenuItem, Button, Grid, Paper,
} from "@mui/material";

const categories = ["Farmer", "Student", "Women", "Senior Citizen", "General", "Health", "Housing"];
const states = ["India", "AP", "UP", "MH", "KA", "TN", "RJ", "DL", "GJ", "WB"];

const FilterBar = ({ onFilter }) => {
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");

  const handleFilter = () => onFilter(category || undefined, state || undefined);
  const handleReset = () => {
    setCategory("");
    setState("");
    onFilter(undefined, undefined);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            select fullWidth label="Category" size="small"
            value={category} onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            select fullWidth label="State" size="small"
            value={state} onChange={(e) => setState(e.target.value)}
          >
            <MenuItem value="">All States</MenuItem>
            {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={1}>
          <Button fullWidth variant="contained" size="small" onClick={handleFilter}
            sx={{ whiteSpace: "nowrap", px: 1 }}>
            Filter
          </Button>
        </Grid>
        <Grid item xs={6} sm={1}>
          <Button fullWidth variant="outlined" size="small" onClick={handleReset}
            sx={{ whiteSpace: "nowrap", px: 1 }}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterBar;
