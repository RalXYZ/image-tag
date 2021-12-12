import * as React from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import ColorfulAvatar from "./colorfulAvatar";

export interface GenericListProp {
  ID: string;
  Name: string;
  UploaderID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface GenericListSkeleton {
  buttonName: string;
  buttonCallback: (id: string) => any;
}

const GenericList: React.FC<{ data: GenericListProp[], skeleton: GenericListSkeleton }> = (props) => {
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
            <TableCell align="left">Go To</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row: GenericListProp) => (
            <TableRow
              key={row.ID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.ID}
              </TableCell>
              <TableCell align="right">
                <ColorfulAvatar name={row.UploaderID} />
              </TableCell>
              <TableCell align="left">{row.Name}</TableCell>
              <TableCell align="left">{row.UploaderID}</TableCell>
              <TableCell align="left">{row.CreatedAt}</TableCell>
              <TableCell align="left">
                <Button
                  variant="contained"
                  onClick={() => props.skeleton.buttonCallback(row.ID)}
                >
                  {props.skeleton.buttonName}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericList;
