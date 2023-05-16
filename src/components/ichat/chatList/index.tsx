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

  const [searchRegExp, setSearchRegExp] = React.useState(/$/);

  //Filter the chats by the search term inputted
  // by the user
  const chatList = chats
    ?.filter((chat) => searchRegExp.test(chat.name as string))
    .map((chat, i) => <ChatListItem key={i} chat={chat} />);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

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
            <InputBase
              sx={styles.inputBase}
              onKeyDown={handleEnter}
              onChange={(e) => setSearchRegExp(new RegExp(e.target.value, "i"))}
              // value={searchRegExp}
              placeholder="Search chat"
              inputProps={{ "aria-label": "search" }}
            />
            <Box sx={styles.searchIconWrapper}>
              <SearchIcon />
            </Box>
          </Box>

          <List disablePadding sx={styles.chatList}>
            {chatList.length ? (
              chatList
            ) : (
              <Typography sx={styles.noResult}>No results</Typography>
            )}
          </List>
        </>
      )}
    </Box>
  );
}
