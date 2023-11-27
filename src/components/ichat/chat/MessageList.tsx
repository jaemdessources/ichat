import React from "react";
//contexts & hooks
import useAppContext from "@/hooks/useAppContext";
import {
  ChatContext,
  ChatMessagesContext,
  UserContext,
  ChatUsersContext,
} from "@/contexts";
//utils
import formatTime from "@/utils/formatTime";
import formatEmoji from "@/utils/formatEmoji";

//models
import {
  User,
  ChatMessagesContext as ChatMessagesContextType,
  Context,
  ChatContext as ChatContextType,
  ChatUsers,
  Message,
  Chat,
} from "@/models";

//mui
// import List from "@mui/material/List";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material";
//my components
import CustomListItem from "@/components/CustomListItem";
//styles
import * as styles from "@/styles/Chat.style";
import Spinner from "@/components/Spinner";

function MessageList({ bottom }: any) {
  const [chatUsers] = useAppContext(ChatUsersContext) as Context<ChatUsers>;
  const [user] = useAppContext(UserContext) as Context<User>;
  const { currentChat, setCurrentChat, setChats } = useAppContext(
    ChatContext
  ) as ChatContextType;
  const { chatMessages, isLoading, error } = useAppContext(
    ChatMessagesContext
  ) as ChatMessagesContextType;

  const currentChatId = currentChat?.id as string;

  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    //Scroll to the bottom of the message list
    // to the newest messages when rendered
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  });

  let currentChatUsers: any = {};

  chatUsers?.[currentChatId]?.forEach((user) => {
    currentChatUsers[user.id] = { name: user.name, username: user.username };
  });

  const messages = chatMessages[currentChatId]?.messages?.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  console.log(
    "the current chat unread message count is",
    currentChat?.unreadMessageCount
  );
  React.useEffect(() => {
    formatEmoji(document.body);
  }, [currentChatId, chatMessages]);

  return (
    <>
      {messages?.length ? (
        <Box sx={styles.messageList(bottom)} ref={listRef}>
          {messages.map((message, i) => {
            const type = user?.id === message.sender ? "sent" : "received";
            const status = message.status;
            const senderUsername =
              user?.id === message.sender
                ? ""
                : currentChatUsers[message.sender]?.username;

            return (
              <Box
                key={i}
                sx={{ ...styles.message, ...styles[type] } as SxProps<Theme>}
              >
                {message.group && (
                  <span className="senderUsername">{senderUsername}</span>
                )}
                <span className="format-emoji">{message.content}</span>
                <Box sx={styles.messageInfo}>
                  <span style={styles.time}>
                    {" "}
                    {message.timestamp ? formatTime(message.timestamp) : null}
                  </span>
                  {type === "sent" && (
                    <span className={`status ${status}`}>
                      {status === "sent" ? "\u2713" : "\u2713\u2713"}
                    </span>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : isLoading ? (
        <Spinner loading={isLoading} />
      ) : error ? (
        <p>Error</p>
      ) : null}
    </>
  );
}

export default MessageList;
