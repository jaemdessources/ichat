import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Spinner from "@/components/Spinner";
import Box from "@mui/material/Box";

//hooks & context
import useAppContext from "@/hooks/useAppContext";
import { ChatContext } from "@/contexts";

//models
import { Chat as ChatType } from "@/models";
//my components
import ChatHeader from "./Header";
import MessageList from "./MessageList";
import MessageBox from "./MessageBox";
//styles
import { chat } from "@/styles/Ichat.style";

function ChatBodyWrapper() {
  const [bottom, setBottom] = React.useState("50px");

  return (
    <>
      <MessageList bottom={bottom} />
      <MessageBox setBottom={setBottom} />
    </>
  );
}
export default function Chat() {
  const [currentChat] = useAppContext<ChatType>(ChatContext);

  return currentChat ? (
    <Box sx={chat}>
      <ChatHeader />
      <ChatBodyWrapper />
    </Box>
  ) : (
    <div></div>
  );
  // <Paper
  //   sx={{
  //     maxWidth: 936,
  //     margin: "auto",
  //     overflow: "hidden",
  //     bgcolor: "transparent",
  //   }}
  // >
  //   <AppBar
  //     position="static"
  //     color="default"
  //     elevation={0}
  //     sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
  //   >
  //     <Toolbar>
  //       <Grid container spacing={2} alignItems="center">
  //         <Grid item>
  //           <SearchIcon color="inherit" sx={{ display: "block" }} />
  //         </Grid>
  //         <Grid item xs>
  //           <TextField
  //             fullWidth
  //             placeholder="Search by email address, phone number, or user UID"
  //             InputProps={{
  //               disableUnderline: true,
  //               sx: { fontSize: "default" },
  //             }}
  //             variant="standard"
  //           />
  //         </Grid>
  //         <Grid item>
  //           <Button variant="contained" sx={{ mr: 1 }}>
  //             Add user
  //           </Button>
  //           <Tooltip title="Reload">
  //             <IconButton>
  //               <RefreshIcon color="inherit" sx={{ display: "block" }} />
  //             </IconButton>
  //           </Tooltip>
  //         </Grid>
  //       </Grid>
  //     </Toolbar>
  //   </AppBar>
  //   <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
  //     No users for this project yet
  //   </Typography>
  // </Paper>
}
