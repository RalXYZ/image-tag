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
import { AssignmentStatusEnum } from "./assignment";

interface AssignmentReviewProp {
  ID: string;
  RequestID: string;
  AssigneeID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Status: number;
};

const Review: React.FC = () => {
  const [listProps, setListProps] = useState<AssignmentReviewProp[]>([]);

  const fetchData = () => {
    fetch(`${config.urlHost}/assignment/review`, {
      credentials: "include",
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setListProps(data as AssignmentReviewProp[]);
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const doReview = (newState: AssignmentStatusEnum, assignmentID: string) => {
    const formData = new FormData();
    formData.append("newState", newState.toString());
    formData.append("assignmentID", assignmentID.toString());
    fetch(`${config.urlHost}/assignment/review`, {
      credentials: "include",
      method: "PUT",
      body: formData,
    }).then(() => {
      fetchData();
    });
  }

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
              <TableCell align="left">{new Date(row.UpdatedAt).toLocaleString()}</TableCell>
              <TableCell align="center">
                <AssignmentStatus status={row.Status} />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="no"
                  color="info"
                  disabled={
                    row.Status !== AssignmentStatusEnum.SUBMITTED
                  }
                  onClick={() => {
                    fetch(`${config.urlHost}/assignment/review/${row.ID}`, {
                      credentials: "include",
                      method: "GET",
                    }).then((res) => {
                      res.json().then((data) => {
                        const result = JSON.parse(data.Result)
                        navigate("/annotation", {
                          state: {
                            images: result.images,
                            tags: result.regionTagList as string[],
                            assignmentID: row.ID,
                            canSubmit: false,
                          }
                        });
                      });
                    });
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  aria-label="check"
                  color="success"
                  disabled={
                    row.Status == AssignmentStatusEnum.SUBMITTED ? false : true
                  }
                  onClick={() => {
                    doReview(AssignmentStatusEnum.ACCEPTED, row.ID);
                  }}
                >
                  <CheckCircleOutlineIcon />
                </IconButton>
                <IconButton
                  aria-label="no"
                  color="error"
                  disabled={
                    row.Status == AssignmentStatusEnum.SUBMITTED ? false : true
                  }
                  onClick={() => {
                    doReview(AssignmentStatusEnum.REJECTED, row.ID);
                  }}
                >
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
