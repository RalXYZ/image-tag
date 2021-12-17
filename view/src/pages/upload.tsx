import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Copyright from "../components/copyright";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import Autocomplete from "@mui/material/Autocomplete";
import config from "../config";
import Box from "@mui/material/Box";

const Input = styled("input")({
  display: "none",
});

const FileList: React.FC<{ files: File[] }> = (props) => {
  return (
    <TableContainer component={Paper} hidden={props.files.length === 0}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.files.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Upload: React.FC = () => {
  const [clipNumber, setClipNumber] = React.useState(10);
  const [name, setName] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [tagList, setTagList] = React.useState<string[]>([]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileArray = Array.from(e.target.files);
    setFiles(fileArray);
    fileArray.forEach((file) => {
      console.log(file);
    });
    console.log(name);
  };

  const onSubmit = async () => {
    console.log(files);
    const createRequestFormData = new FormData();
    createRequestFormData.append("name", name);
    createRequestFormData.append("tags", JSON.stringify(tagList));
    const res = await fetch(`${config.urlHost}/request`, {
      credentials: "include",
      method: "POST",
      body: createRequestFormData,
    });

    const processedFiles: File[] = [];

    files.map(async (file) => {
      return new Promise<void>(async (resolve) => {
        if (/image\/*/.test(file.type)) {
          processedFiles.push(file);
        } else if (/video\/*/.test(file.type)) {
          let counter = 0;

          const video = new HTMLVideoElement();
          video.src = URL.createObjectURL(file);

          new Array(clipNumber).forEach((_, i) => {
            video.currentTime = (video.duration / clipNumber) * i;
            const canvas = new HTMLCanvasElement();
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            canvas.toBlob((blob) => {
              processedFiles.push(blob as File);
              counter += 1;
            });
          });

          while (counter < clipNumber) {
            await new Promise((r) => setTimeout(r, 100));
          }

          resolve();
        }
      });
    });

    const requestId = await res.text();
    const presignedReqFormData = new FormData();
    presignedReqFormData.append("requestId", requestId);

    const presignedRes = await Promise.all(
      processedFiles.map(() => {
        return fetch(`${config.urlHost}/media`, {
          credentials: "include",
          method: "POST",
          body: presignedReqFormData,
        });
      })
    );

    console.log(presignedRes);

    const presignedResJson = await Promise.all(
      presignedRes.map((res) => res.json())
    );

    const minioRes = await Promise.all(
      presignedResJson.map((json, i) => {
        const formData = new FormData();
        formData.append("bucket", json.policy.bucket);
        formData.append("key", json.policy.key);
        formData.append("policy", json.policy.policy);
        formData.append("x-amz-algorithm", json.policy["x-amz-algorithm"]);
        formData.append("x-amz-credential", json.policy["x-amz-credential"]);
        formData.append("x-amz-date", json.policy["x-amz-date"]);
        formData.append("x-amz-signature", json.policy["x-amz-signature"]);
        formData.append("file", processedFiles[i]);
        return fetch(json.url, {
          method: "POST",
          body: formData,
        });
      })
    );

    console.log(minioRes);

    await Promise.all(
      presignedResJson.map(async (json) => {
        const formData = new FormData();
        formData.append("uuid", json.uuid);
        return fetch(`${config.urlHost}/media/seal`, {
          credentials: "include",
          method: "PUT",
          body: formData,
        });
      })
    );

    const sealRequestReqFormData = new FormData();
    sealRequestReqFormData.append("requestId", requestId);
    await fetch(`${config.urlHost}/request/seal`, {
      credentials: "include",
      method: "PUT",
      body: sealRequestReqFormData,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Assignment Name"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="tags"
                      placeholder="fill in the tag and press ENTER to add it"
                    />
                  )}
                  onChange={(e, value) => {
                    setTagList(value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box style={{ display: "flex", justifyContent: "space-between"}}>
                  <label htmlFor="contained-button-file">
                    <Input
                      accept="image/*,video/*"
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={onFileChange}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<UploadFileIcon />}
                    >
                      Select Files
                    </Button>
                  </label>
                  <Button
                    variant="contained"
                    component="span"
                    endIcon={<SendIcon />}
                    onClick={onSubmit}
                  >
                    Upload
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FileList files={files} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
};

export default Upload;
