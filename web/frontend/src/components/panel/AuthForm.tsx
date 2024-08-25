import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import styles from "./AuthForm.module.scss";

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.ok) {
        console.log("response", response);
      } else {
        console.log("error", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.ok) {
        console.log("response", response);
      } else {
        console.log("error", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card variant="outlined" className={`mt-2 ${styles.card}`}>
      <CardContent>
        <Typography variant="h6">Login / Signup</Typography>
        <Box padding={1}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" padding={1}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSignup}>
            Signup
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
