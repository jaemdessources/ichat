//lib
import React from "react";

//utils && hooks && context
import useAppContext from "@/hooks/useAppContext";
import useFetchData from "@/hooks/useFetchData";
import { UserContext } from "@/contexts";

//models
import { Chat, User } from "@/models";

//mui
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { Typography, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
//my components
import ChatListItem from "./ChatListItem";
//utils
import userService from "@/services/userService";

//styles
import * as styles from "@/styles/ChatList.style";

export default function ChatList() {
  const [user] = useAppContext<User>(UserContext);

  const {
    data: chats,
    isError,
    isLoading,
  } = useFetchData<Chat[]>(
    { url: "/chats", userId: user?.id as string },
    userService.getChats
  );

  return (
    <Box sx={styles.paper}>
      {isError ? (
        <Typography sx={styles.title} component="p">
          Error !
        </Typography>
      ) : isLoading ? (
        <Typography sx={styles.title} component="p">
          Loading ...
        </Typography>
      ) : (
        <>
          <Typography sx={styles.title} variant="h5">
            Chats
          </Typography>
          <Box sx={styles.search}>
            <Box sx={styles.searchIconWrapper}>
              <SearchIcon />
            </Box>
            <InputBase
              sx={styles.inputBase}
              // onKeyDown={handleKeyPress}
              // onChange={(e) => setQuery(e.target.value)}
              // value={query}
              placeholder="Rechercher"
              inputProps={{ "aria-label": "search" }}
            />
          </Box>

          <List disablePadding sx={styles.chatList}>
            {chats?.map((chat, i) => (
              <ChatListItem key={i} chat={chat} />
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
