import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { navigate } from "gatsby";

export const mainListItems = (
  <div>
    <ListItem button onClick={() => navigate("/")}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button onClick={() => navigate("/upload")}>
      <ListItemIcon>
        <CloudUploadIcon />
      </ListItemIcon>
      <ListItemText primary="Upload" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>My</ListSubheader>
    <ListItem button onClick={() => navigate("/request")}>
      <ListItemIcon>
        <PermMediaIcon />
      </ListItemIcon>
      <ListItemText primary="Request" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentReturnedIcon />
      </ListItemIcon>
      <ListItemText primary="Assignment" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReviewsIcon />
      </ListItemIcon>
      <ListItemText primary="Review" />
    </ListItem>
  </div>
);
