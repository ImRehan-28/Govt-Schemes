import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Button, TextField, MenuItem,
  Paper, Chip, CircularProgress, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  approveScheme, rejectScheme,
  createScheme, fetchGovtSchemes, getAllSchemesAdmin,
} from "../api/schemes";

const categories = ["Farmer", "Student", "Women", "Senior Citizen", "General", "Health", "Housing"];
const states = ["India", "AP", "UP", "MH", "KA", "TN", "RJ", "DL", "GJ", "WB"];

const emptyForm = {
  name: "", description: "", category: "", eligibility: "",
  benefits: "", state: "", ministry: "", link: "",
};

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [allSchemes, setAllSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snack, setSnack] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  const [fetchingGovt, setFetchingGovt] = useState(false);

  const navigate = useNavigate();

  const fetchAllAdmin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllSchemesAdmin();
      setAllSchemes(res.data || []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        navigate("/login");
      } else {
        setError("Failed to load schemes. Make sure backend is running on port 8080.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdmin();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveScheme(id);
      setSnack("Scheme approved!");
      fetchAllAdmin();
    } catch {
      setSnack("Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectScheme(id);
      setSnack("Scheme rejected!");
      fetchAllAdmin();
    } catch {
      setSnack("Failed to reject.");
    }
  };

  const handleFetchGovt = async () => {
    setFetchingGovt(true);
    try {
      await fetchGovtSchemes();
      setSnack("Govt schemes fetched and saved as PENDING!");
      fetchAllAdmin();
    } catch (err) {
      const msg = err?.response?.data || err?.message || "Failed to fetch govt schemes.";
      setSnack(`Error: ${msg}`);
    } finally {
      setFetchingGovt(false);
    }
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await createScheme(form);
      setSnack("Scheme created successfully!");
      setDialogOpen(false);
      setForm(emptyForm);
      fetchAllAdmin();
    } catch {
      setSnack("Failed to create scheme.");
    } finally {
      setFormLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    return "warning";
  };

  const filtered = tab === 0 ? allSchemes
    : tab === 1 ? allSchemes.filter((s) => s.status === "PENDING")
    : tab === 2 ? allSchemes.filter((s) => s.status === "APPROVED")
    : allSchemes.filter((s) => s.status === "REJECTED");

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#1a237e", color: "white", py: { xs: 3, md: 5 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Manage all government schemes
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined" color="inherit" startIcon={<CloudDownloadIcon />}
                onClick={handleFetchGovt} disabled={fetchingGovt}
              >
                {fetchingGovt ? <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} /> : null}
                Fetch Govt API
              </Button>
              <Button
                variant="contained" startIcon={<AddIcon />}
                sx={{ bgcolor: "white", color: "#1a237e", "&:hover": { bgcolor: "#e8eaf6" } }}
                onClick={() => setDialogOpen(true)}
              >
                Add Scheme
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: "Total", count: allSchemes.length, color: "#1a237e" },
            { label: "Pending", count: allSchemes.filter((s) => s.status === "PENDING").length, color: "#f57c00" },
            { label: "Approved", count: allSchemes.filter((s) => s.status === "APPROVED").length, color: "#2e7d32" },
            { label: "Rejected", count: allSchemes.filter((s) => s.status === "REJECTED").length, color: "#c62828" },
          ].map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 3, textAlign: "center", borderTop: `4px solid ${stat.color}` }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: stat.color }}>{stat.count}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Rejected" />
          </Tabs>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" py={6}>
              No schemes in this category.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>State</strong></TableCell>
                    <TableCell><strong>Ministry</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((scheme) => (
                    <TableRow key={scheme.id} hover>
                      <TableCell>{scheme.id}</TableCell>
                      <TableCell sx={{ maxWidth: 180 }}>
                        <Typography variant="body2" fontWeight={600}>{scheme.name}</Typography>
                      </TableCell>
                      <TableCell>{scheme.category}</TableCell>
                      <TableCell>{scheme.state}</TableCell>
                      <TableCell>{scheme.ministry}</TableCell>
                      <TableCell>
                        <Chip
                          label={scheme.status}
                          color={statusColor(scheme.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {scheme.status !== "APPROVED" && (
                            <IconButton color="success" size="small" onClick={() => handleApprove(scheme.id)}
                              title="Approve">
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          )}
                          {scheme.status !== "REJECTED" && (
                            <IconButton color="error" size="small" onClick={() => handleReject(scheme.id)}
                              title="Reject">
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Add Scheme Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add New Scheme</DialogTitle>
        <Box component="form" onSubmit={handleCreateScheme}>
          <DialogContent>
            <Grid container spacing={2}>
              {[
                { name: "name", label: "Scheme Name" },
                { name: "description", label: "Description" },
                { name: "eligibility", label: "Eligibility" },
                { name: "benefits", label: "Benefits" },
                { name: "ministry", label: "Ministry" },
                { name: "link", label: "Official Link" },
              ].map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth required={["name", "description", "category", "state"].includes(field.name)}
                    label={field.label} name={field.name}
                    value={form[field.name]} onChange={handleFormChange}
                    multiline={field.name === "description"} rows={field.name === "description" ? 3 : 1}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth required label="Category" name="category"
                  value={form.category} onChange={handleFormChange}>
                  {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth required label="State" name="state"
                  value={form.state} onChange={handleFormChange}>
                  {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: "#1a237e" }} disabled={formLoading}>
              {formLoading ? <CircularProgress size={20} color="inherit" /> : "Create Scheme"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={!!snack} autoHideDuration={3000}
        onClose={() => setSnack("")} message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default AdminDashboard;
