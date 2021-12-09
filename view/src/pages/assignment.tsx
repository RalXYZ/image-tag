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
import type { GenericListProp } from "../components/genericList";
import AssignmentStatus from "../components/assignmentStatus";

interface AssignmentProp {
  Request: GenericListProp;
  Status: number;
}

const Discover: React.FC = () => {
  const [listProps, setListProps] = useState<AssignmentProp[]>([]);

  useEffect(() => {
    fetch(`${config.urlHost}/assignment`, {
      credentials: "include",
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setListProps(data as AssignmentProp[]);
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
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Username</TableCell>
            <TableCell align="left">Create Time</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listProps.map((row) => (
            <TableRow
              key={row.Request.ID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.Request.ID}
              </TableCell>
              <TableCell align="right">
                <ColorfulAvatar name={row.Request.UploaderID} />
              </TableCell>
              <TableCell align="left">{row.Request.Name}</TableCell>
              <TableCell align="left">{row.Request.UploaderID}</TableCell>
              <TableCell align="left">{row.Request.CreateTime}</TableCell>
              <TableCell align="left">
                <AssignmentStatus status={row.Status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Discover;
