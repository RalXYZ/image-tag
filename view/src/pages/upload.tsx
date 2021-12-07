import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import mdTheme from "../theme";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "../components/sidebar";
import TopBar from "../components/topbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Copyright from "../components/copyright";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
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

const FileList: React.FC<{ files: File[] }> = (props: { files: File[] }) => {
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
  const [open, setOpen] = React.useState<boolean>(true);
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

  const onSubmit = () => {
    console.log(files);
    const formData = new FormData();
    formData.append("name", name);
    fetch(`${config.urlHost}/request`, {
      credentials: "include",
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.status / 100 !== 2) {
          throw new Error("Filed to create annotation request");
        }
        res.text().then((text) => {
          const requestId = text;
          const formData = new FormData();
          formData.append("requestId", requestId);
          Promise.all(
            files.map((file) => {
              return fetch(`${config.urlHost}/media`, {
                credentials: "include",
                method: "POST",
                body: formData,
              });
            })
          ).then((res) => {
            Promise.all(
              res.map((r, i) => {
                r.json().then((json) => {
                  const formData = new FormData();
                  formData.append("bucket", json.bucket);
                  formData.append("key", json.key);
                  formData.append("policy", json.policy);
                  formData.append("x-amz-algorithm", json.x_amz_algorithm);
                  formData.append("x-amz-credential", json.x_amz_credential);
                  formData.append("x-amz-date", json.x_amz_date);
                  formData.append("x-amz-signature", json.x_amz_signature);
                  formData.append("file", files[i]);
                });
              })
            );
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar open={open} setOpen={setOpen} title="Upload" />
        <Sidebar open={open} setOpen={setOpen} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
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
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Upload;
