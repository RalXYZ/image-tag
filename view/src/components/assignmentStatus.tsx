import React from "react";
import Chip from "@mui/material/Chip";

const AssignmentStatus: React.FC<{ status: number }> = (props) => {
  return (
    <Chip
      label={
        props.status === 0
          ? "claimed"
          : props.status === 1
          ? "checking"
          : props.status === 2
          ? "accepted"
          : props.status === 3
          ? "rejected"
          : "unknown"
      }
      color={
        props.status === 0
          ? "primary"
          : props.status === 1
          ? "warning"
          : props.status === 2
          ? "success"
          : props.status === 3
          ? "error"
          : "default"
      }
    />
  );
};

export default AssignmentStatus;
