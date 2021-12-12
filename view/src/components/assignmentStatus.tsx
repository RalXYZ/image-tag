import React from "react";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ClearIcon from '@mui/icons-material/Clear';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const AssignmentStatus: React.FC<{ status: number }> = (props) => {
  return props.status === 0
      ? <PendingActionsIcon color="info" />
      : props.status === 1
      ? <DoneIcon color="warning" />
      : props.status === 2
      ? <DoneAllIcon color="success" />
      : props.status === 3
      ? <ClearIcon color="error" />
      : <QuestionMarkIcon color="disabled" />;
};

export default AssignmentStatus;
