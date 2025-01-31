import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { loginUser } from "../services/api";
import { Container, Card, CardContent, TextField, Button, Box, Alert } from "@mui/material";
import React from "react";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email) {
      setError("Both Name and Email are required.");
      return;
    }

    try {
      await loginUser(name, email); 
      dispatch(login({ name, email })); 
      navigate("/search"); 
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField 
              label="Name" 
              variant="outlined" 
              fullWidth 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
            <TextField 
              label="Email" 
              type="email" 
              variant="outlined" 
              fullWidth 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{backgroundColor:"#fba918", color:"white" , borderColor:"#fba918" }} fullWidth>
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
