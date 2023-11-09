//lib
import React from "react";

//utils && hooks && context
import useAppContext from "@/hooks/useAppContext";
import { ChatContext, ChatMessagesContext, UserContext } from "@/contexts";

//models
import {
  ChatContext as ChatContextType,
  ChatMessagesContext as ChatMessagesContextType,
  Chat,
} from "@/models";

//mui
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { Typography, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddChatIcon from "@mui/icons-material/AddComment";
//my components
import ChatListItem from "./ChatListItem";
import NewChat from "@/components/ichat/NewChat/NewChatBox";

//styles
import * as styles from "@/styles/ChatList.style";

export default function ChatList() {
  const { chats, isLoading, isError, currentChat, setChats } = useAppContext(
    ChatContext
  ) as ChatContextType;

  const { isLoading: messagesLoading } = useAppContext(
    ChatMessagesContext
  ) as ChatMessagesContextType;

  React.useEffect(() => {
    setChats((prev) => ({
      ...prev,
      [currentChat?.secondaryId as string]: currentChat as Chat,
    }));
  }, [currentChat, setChats]);

  const [searchRegExp, setSearchRegExp] = React.useState(/$/);

  //Filter the chats by the search term inputted
  // by the user

  const chatList = Object.values(chats)
    ?.filter((chat) => {
      console.log(chat?.unreadMessageCount);
      return searchRegExp.test(chat?.name as string);
    })
    .map((chat, i) => <ChatListItem key={i} chat={chat} />);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const [newChatOpen, setNewChatOpen] = React.useState(false);

  return (
    <Box sx={styles.paper}>
      {isError ? (
        <Typography sx={styles.title} component="p">
          Error !
        </Typography>
      ) : isLoading || messagesLoading ? (
        <Typography sx={styles.title} component="p">
          Loading ...
        </Typography>
      ) : (
        <>
          {/* Header */}
          <Box sx={styles.header}>
            <Typography sx={styles.title} variant="h5">
              Chats
            </Typography>
            {/* New CHat Icon */}
            <Box title="Start a new chat" sx={styles.addChatIcon}>
              <Button onClick={() => setNewChatOpen(true)}>
                <AddChatIcon sx={{ fill: "var(--accent_color)" }} />
              </Button>
              <NewChat open={newChatOpen} setOpen={setNewChatOpen}></NewChat>
            </Box>
          </Box>

          {/* Search Box */}
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
            {chatList?.length ? (
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
