import { useState } from "react";
import {
  Box, Button, TextField, Typography, Paper, CircularProgress, Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/schemes";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(`[Login] Login attempt - username: ${username}`);
    setLoading(true);
    setError("");
    try {
      const res = await login(username, password);
      console.log("[Login] Login successful, token received");
      loginUser(res.data);
      navigate("/admin");
    } catch {
      console.error("[Login] Login failed - invalid credentials");
      setError("Invalid credentials. Use admin / admin123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f4ff",
        px: 2,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 420, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={1}>
          🏛️ Admin Login
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Government Scheme Management System
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username" fullWidth required
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password" type="password" fullWidth required
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit" variant="contained" size="large" fullWidth
            disabled={loading} sx={{ bgcolor: "#1a237e" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
