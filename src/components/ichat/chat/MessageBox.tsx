import React from "react";
import { v4 as uuid4 } from "uuid";
//mui
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
//models
import {
  Message,
  Chat,
  User,
  ChatMessagesContext as ChatMessagesContextType,
} from "@/models";
import { Socket } from "socket.io-client";
//styles
import { messageBox, textField } from "@/styles/Chat.style";
//hooks & contexts
import useAppContext from "@/hooks/useAppContext";
import {
  ChatContext,
  ChatMessagesContext,
  SocketIoContext,
  UserContext,
} from "@/contexts";

function MessageBox({ setBottom }: any) {
  const [currentChat] = useAppContext<Chat>(ChatContext);
  const currentChatId = currentChat?.id;
  const [user] = useAppContext(UserContext) as [User];
  const [socket] = useAppContext<Socket>(SocketIoContext);

  const { chatMessages, setChatMessages } = useAppContext(
    ChatMessagesContext
  ) as ChatMessagesContextType;

  const [message, setMessage] = React.useState("");

  const handleSendMessage = () => {
    const data: Message = {
      id: uuid4(),
      sender: user?.id as string,
      content: message,
      chat: currentChat?.id as string,
      timestamp: new Date(),
    };

    const newMessages = chatMessages[currentChatId]
      ? {
          messages: [...chatMessages[currentChatId].messages, data],
          lastFetched: chatMessages[currentChatId].lastFetched,
        }
      : { messages: [data] };
    setChatMessages?.((prev) => ({
      ...prev,
      [currentChatId]: newMessages,
    }));
    socket?.emit("send-message", { ...data, recipients: currentChat?.users });
    setMessage("");
    setBottom("50px");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //prevent a new line to be created and
    //Send the message when the Enter key is pressed
    if (!/Enter|NumpadEnter/.test(e.key)) return;
    else {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * UI Effects
   */
  //when the value of message changes, update the "bottom" state
  const messageBoxRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (message !== "")
      setBottom(getComputedStyle(messageBoxRef?.current as Element).height);
  }, [message, setBottom]);

  return (
    <Box component="div" sx={messageBox} ref={messageBoxRef}>
      <TextField
        id="textField"
        multiline
        maxRows={4}
        value={message}
        onChange={handleChange}
        onKeyDown={handleEnter}
        placeholder="Type something..."
        variant="standard"
        sx={textField}
      />
      <SendIcon sx={{ cursor: "pointer" }} onClick={handleSendMessage} />
    </Box>
  );
}

export default MessageBox;
