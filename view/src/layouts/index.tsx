import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import mdTheme from "../theme";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "../components/sidebar";
import TopBar from "../components/topbar";
import Toolbar from "@mui/material/Toolbar";

const Layout: React.FC = (props) => {
  const [open, setOpen] = React.useState(true);
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar open={open} setOpen={setOpen} title="Image Annotation" />
        <Sidebar open={open} setOpen={setOpen} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {props.children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
