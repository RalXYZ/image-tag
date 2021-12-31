import * as React from "react";
import config from "../config";
import { navigate } from "gatsby";
import { useState, useEffect } from "react";
import Image from "material-ui-image";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Fab from "@mui/material/Fab";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import { GenericListProp } from "../components/genericList";

const Detail: React.FC<{
  location: {
    state: {
      requestId: string;
    };
  };
}> = (props) => {
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [request, setRequest] = useState<GenericListProp>();

  useEffect(() => {
    fetch(`${config.urlHost}/media/request/${props.location.state.requestId}`, {
      credentials: "include",
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setImgUrls((data).map((d) => d.Src));
      });
    });
  }, []);

  useEffect(() => {
    fetch(`${config.urlHost}/request/id/${props.location.state.requestId}`, {
      credentials: "include",
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setRequest(data as GenericListProp);
      });
    });
  }, []);

  return (
    <Box>
      <Card sx={{ padding: "8px", margin: "8px" }}>
        <Typography variant="h3" component="div" gutterBottom>
          {request?.Name}
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          Uploaded by {request?.UploaderID}
        </Typography>
      </Card>
      <Card sx={{ padding: "8px", margin: "8px" }}>
        <Grid container spacing={2}>
          {imgUrls.map((url: string, id) => (
            <Grid item key={id} xs={12} sm={6} md={4} lg={3}>
              <Image src={url} color="gray" animationDuration={500} />
            </Grid>
          ))}
        </Grid>
      </Card>
      <Fab
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        variant="extended"
        color="primary"
        aria-label="add"
        onClick={() => {
          fetch(`${config.urlHost}/assignment/request/${props.location.state.requestId}`, {
            credentials: "include",
            method: "POST",
          }).then((res) => {
            console.log(res);
            navigate("/assignment");
          });
        }}
      >
        <AssignmentReturnedIcon sx={{ mr: 1 }} />
        Claim
      </Fab>
    </Box>
  );
};

export default Detail;
