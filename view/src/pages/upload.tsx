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
import config from "../config";

const Input = styled("input")({
  display: "none",
});

const FileList: React.FC<{ files: File[] }> = (props) => {
  return (
    <TableContainer component={Paper}>
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
  const [name, setName] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);

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
    const res = await fetch(`${config.urlHost}/request`, {
      credentials: "include",
      method: "POST",
      body: createRequestFormData,
    });

    const requestId = await res.text();
    const presignedReqFormData = new FormData();
    presignedReqFormData.append("requestId", requestId);

    const presignedRes = await Promise.all(
      files.map(() => {
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
        formData.append("file", files[i]);
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
          method: "POST",
          body: formData,
        });
      })
    );

    const sealRequestReqFormData = new FormData();
    sealRequestReqFormData.append("requestId", requestId);
    await fetch(`${config.urlHost}/request/seal`, {
      credentials: "include",
      method: "POST",
      body: sealRequestReqFormData,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-basic"
              label="Assignment Name"
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
            />
            <FileList files={files} />
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
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
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
};

export default Upload;
