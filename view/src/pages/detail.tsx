import * as React from "react";
import config from "../config";
import { useState, useEffect } from "react";
import Image from "material-ui-image";
import Grid from "@mui/material/Grid";

const Detail: React.FC<{
  location: {
    state: {
      requestId: string;
    };
  };
}> = (props) => {
  const [imgUrls, setImgUrls] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${config.urlHost}/media/request/${props.location.state.requestId}`, {
      credentials: "include",
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setImgUrls(data as string[]);
      });
    });
  }, []);

  return (
    <Grid container spacing={2}>
      {imgUrls.map((url: string) => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Image src={url} color="black" />
        </Grid>
      ))}
    </Grid>
  );
};

export default Detail;
