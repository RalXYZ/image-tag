import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import Copyright from "../components/copyright";
import config from "../config";
import { navigate } from "gatsby";
import { useState } from "react";
import { Link as GatsbyLink } from "gatsby";

export default function Register() {
  const [error, setError] = useState<"ok" | "username" | "password" | "email">(
    "ok"
  );
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // validate username
    if ((event.currentTarget.elements as any).username.value.length <= 6) {
      setError("username");
      return;
    }

    // validate email
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        (event.currentTarget.elements as any).email.value
      )
    ) {
      setError("email");
      return;
    }

    // validate password
    if ((event.currentTarget.elements as any).password.value.length <= 6) {
      setError("password");
      return;
    }

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch(`${config.urlHost}/user`, {
      method: "POST",
      body: data,
    })
      .then((response) => {
        if (response.status >> 2 === 200) {
          navigate("/login");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  helperText={
                    error === "username"
                      ? "username must be longer than 6 characters and unique"
                      : ""
                  }
                  error={error === "username"}
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  helperText={
                    error === "email" ? "email must be valid and unique" : ""
                  }
                  error={error === "email"}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  helperText={
                    error === "password"
                      ? "password must be longer than 6 characters"
                      : ""
                  }
                  error={error === "password"}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <GatsbyLink to="/login">
                  Already have an account? Sign in
                </GatsbyLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
