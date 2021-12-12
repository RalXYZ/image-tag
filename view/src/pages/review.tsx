import * as React from "react";
import config from "../config";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import ColorfulAvatar from "../components/colorfulAvatar";
import AssignmentStatus from "../components/assignmentStatus";
import { navigate } from "gatsby-link";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";

interface AssignmentReviewProp {
  ID: string;
  RequestID: string;
  AssigneeID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Status: number;
}

const Review: React.FC = () => {
  const [listProps, setListProps] = useState<AssignmentReviewProp[]>([]);

  useEffect(() => {
    fetch(`${config.urlHost}/assignment/review`, {
      credentials: "include",
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setListProps(data as AssignmentReviewProp[]);
      });
    });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="left">Avatar</TableCell>
            <TableCell align="left">Assignee Username</TableCell>
            <TableCell align="left">Update Time</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listProps.map((row) => (
            <TableRow
              key={row.ID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.ID}
              </TableCell>
              <TableCell align="right">
                <ColorfulAvatar name={row.AssigneeID} />
              </TableCell>
              <TableCell align="left">{row.AssigneeID}</TableCell>
              <TableCell align="left">{row.UpdatedAt}</TableCell>
              <TableCell align="center">
                <AssignmentStatus status={row.Status} />
              </TableCell>
              <TableCell align="center">
                <IconButton aria-label="no" color="info">
                  <VisibilityIcon />
                </IconButton>
                <IconButton aria-label="check" color="success">
                  <CheckCircleOutlineIcon />
                </IconButton>
                <IconButton aria-label="no" color="error">
                  <DoNotDisturbIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Review;
