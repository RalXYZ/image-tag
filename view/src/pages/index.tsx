import * as React from "react";
import Container from "@mui/material/Container";
import Copyright from "../components/copyright";
import Typography from "@mui/material/Typography";

function DashboardContent() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h1" component="div" gutterBottom>
        Welcome!
      </Typography>
    </Container>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
