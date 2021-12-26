import * as React from "react";
import config from "../config";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { navigate } from "gatsby";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/material";
import ColorfulAvatar from "./colorfulAvatar";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth: number = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}> = (props) => {
  const [username, setUsername] = React.useState<string>("?");

  React.useEffect(() => {
    fetch(`${config.urlHost}/user`, {
      credentials: "include",
      method: "GET",
    })
      .then((res) => {
        if (Math.floor(res.status / 100) !== 2) {
          return;
        }
        res.text().then((data) => {
          console.log(data);
          setUsername(data);
        });
      });
  }, []);

  return (
    <AppBar position="absolute" open={props.open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => {
            props.setOpen(!props.open);
          }}
          sx={{
            marginRight: "36px",
            ...(props.open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {props.title}
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Box
          onClick={() => {
            username === "?"
              ? navigate("/login")
              : fetch(`${config.urlHost}/user/logout`, {
                  credentials: "include",
                  method: "POST",
                }).then((res) => {
                  if (Math.floor(res.status / 100) !== 2) {
                    return;
                  }
                  setUsername("?");
                  navigate("/");
                });
          }}
        >
          <ColorfulAvatar name={username} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
