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
import Box from "@mui/material/Box";
import AssignmentStatus from "../components/assignmentStatus";
import { navigate } from "gatsby-link";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import IconButton from "@mui/material/IconButton";
import { AssignmentStatusEnum } from "./assignment";
import ExportDialog from "../components/exportDialog";
import type { project } from "../utils/exportData";
import { exportCOCO, exportVOC } from "../utils/exportData";

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
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [exportDataSet, setExportDataSet] = React.useState<"coco" | "voc">(
    "coco"
  );
  const [clickedReviewID, setClickedReviewID] = React.useState("");
  const [clickedRequestID, setClickedRequestID] = React.useState("");

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

  const doExport = async () => {
    console.log([clickedReviewID, clickedRequestID]);
    let p: project = {} as project;
    p.name = "just_a_test";
    await Promise.all([
      fetch(`${config.urlHost}/assignment/review/${clickedReviewID}`, {
        credentials: "include",
        method: "GET",
      }).then(async (res) => {
        const data = JSON.parse((await res.json()).Result);
        p.annotations = data.images;
        p.regionClsList = data.regionClsList;
        p.regionTagList = data.regionTagList;
      }),
      fetch(`${config.urlHost}/media/request/${clickedRequestID}`, {
        credentials: "include",
        method: "GET",
      }).then(async (res) => {
        const data = (await res.json()) as any[];
        p.images = data.map((item) => ({
          id: item.UUID,
          uploadTime: item.CreatedAt,
        }));
      }),
    ]);
    console.log(p);
    if (exportDataSet === "coco") {
      exportCOCO(p);
    } else if (exportDataSet === "voc") {
      exportVOC(p);
    }
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
  };

  return (
    <Box>
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
                <TableCell align="left">
                  {new Date(row.UpdatedAt).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <AssignmentStatus status={row.Status} />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="no"
                    color="info"
                    disabled={row.Status !== AssignmentStatusEnum.SUBMITTED}
                    onClick={() => {
                      fetch(`${config.urlHost}/assignment/review/${row.ID}`, {
                        credentials: "include",
                        method: "GET",
                      }).then((res) => {
                        res.json().then((data) => {
                          const result = JSON.parse(data.Result);
                          navigate("/annotation", {
                            state: {
                              images: result.images,
                              tags: result.regionTagList as string[],
                              assignmentID: row.ID,
                              canSubmit: false,
                            },
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
                      row.Status === AssignmentStatusEnum.SUBMITTED
                        ? false
                        : true
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
                      row.Status === AssignmentStatusEnum.SUBMITTED
                        ? false
                        : true
                    }
                    onClick={() => {
                      doReview(AssignmentStatusEnum.REJECTED, row.ID);
                    }}
                  >
                    <DoNotDisturbIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    disabled={
                      row.Status === AssignmentStatusEnum.ACCEPTED
                        ? false
                        : true
                    }
                    onClick={() => {
                      setClickedReviewID(row.ID);
                      setClickedRequestID(row.RequestID);
                      setDialogOpen(true);
                    }}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExportDialog
        open={dialogOpen}
        dataSet={exportDataSet}
        setClose={() => setDialogOpen(false)}
        setDataSet={(dataSet: "coco" | "voc") => setExportDataSet(dataSet)}
        exportDataSet={doExport}
      />
    </Box>
  );
};

export default Review;
