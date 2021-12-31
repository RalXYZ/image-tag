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
import Button from "@mui/material/Button";
import { navigate } from "gatsby-link";

interface AssignmentProp {
  ID: number;
  Request: GenericListProp;
  Status: number;
}

export enum AssignmentStatusEnum {
  CLAIMED = 0,
  SUBMITTED = 1,
  ACCEPTED = 2,
  REJECTED = 3,
};

const Assignment: React.FC = () => {
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
            <TableCell align="left">Update Time</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
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
              <TableCell align="left">{new Date(row.Request.UpdatedAt).toLocaleString()}</TableCell>
              <TableCell align="center">
                <AssignmentStatus status={row.Status} />
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  disabled={row.Status !== AssignmentStatusEnum.CLAIMED && row.Status !== AssignmentStatusEnum.REJECTED}
                  onClick={() => {
                    fetch(`${config.urlHost}/media/request/${row.Request.ID}`, {
                      credentials: "include",
                      method: "GET",
                    }).then((res) => {
                      res.json().then((data) => {
                        const imageList = data.map((item, i) => {
                          return {
                            key: i,
                            src: item.Src,
                            name: item.Src.split("?").shift().split("/").pop(),
                            regions: [],
                          }
                        });
                        navigate("/annotation", {
                          state: {
                            images: imageList,
                            tags: JSON.parse(row.Request.Tags) as string[],
                            assignmentID: row.ID,
                            canSubmit: true,
                          }
                        });
                      });
                    });
                  }}
                >
                  Annotate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Assignment;
