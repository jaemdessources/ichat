import * as React from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

//hooks & context
import useAppContext from "@/hooks/useAppContext";
import { ChatContext, ChatUsersContext, UserContext } from "@/contexts";

//models
import {
  ChatContext as ChatContextType,
  Chat as ChatType,
  ChatUsers,
  User,
  Context,
} from "@/models";
//my components
import ChatHeader from "./Header";
import MessageList from "./MessageList";
import MessageBox from "./MessageBox";
//styles
import * as styles from "@/styles/Ichat.style";
import userService from "@/services/userService";
import ContextProvider from "@/components/providers/ContextProvider";

export default function Chat() {
  const { currentChat } = useAppContext(ChatContext) as ChatContextType;
  const currentChatId = currentChat?.id;
  const [currentUser] = useAppContext(UserContext) as [User];
  const [chatUsers, setChatUsers] = useAppContext(
    ChatUsersContext
  ) as Context<ChatUsers>;

  React.useEffect(() => {
    //if we do not have the data for the other chat participants
    //for the current chat, fetch'em
    if (currentChatId && !chatUsers?.[currentChatId]?.length) {
      const chatUsersPromise = currentChat?.users
        .filter((id) => id !== currentUser?.id)
        .map((id) => userService.getUser(id));

      Promise.all(chatUsersPromise).then((result) => {
        setChatUsers?.((prev) => ({
          ...prev,
          [currentChatId]: result,
        }));
      });
    }
    ////eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatUsers, currentChat, currentChatId, setChatUsers, currentUser]);

  return currentChat ? (
    <Box sx={styles.chat}>
      <ChatHeader />
      <ChatBodyWrapper />
    </Box>
  ) : (
    <Box sx={styles.emptyChatArea}>
      <Image src="/chat.png" width="80" height="80" alt="" />
      <Typography variant="h3">Ichat</Typography>
      <Typography>Send and receive messages. Chat, your way...</Typography>
    </Box>
  );
}

function ChatBodyWrapper() {
  const [bottom, setBottom] = React.useState("50px");

  return (
    <>
      <MessageList bottom={bottom} />
      <MessageBox setBottom={setBottom} />
    </>
  );
}
