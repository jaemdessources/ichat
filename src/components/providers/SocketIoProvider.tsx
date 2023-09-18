import React from "react";
import {
  ChatContext,
  ChatUsersContext,
  ChatMessagesContext,
  SocketIoContext,
  UserContext,
} from "@/contexts";

import {
  User,
  Chat,
  ChatUsers,
  Message,
  ChatMessagesContext as ChatMessagesContextType,
  ChatContext as ChatContextType,
  Context,
} from "@/models";
import useAppContext from "@/hooks/useAppContext";
import { Socket, io } from "socket.io-client";

function SocketIoProvider(props: any) {
  const [socket, setSocket] = React.useState<Socket | undefined>();
  const [user] = useAppContext(UserContext) as [User];
  const { setCurrentChat, chats, setChats, currentChat } = useAppContext(
    ChatContext
  ) as ChatContextType;
  const { chatMessages, setChatMessages } = useAppContext(
    ChatMessagesContext
  ) as ChatMessagesContextType;

  React.useEffect(() => {
    let newSocket: Socket | null = null;

    //Complete the handshake with the socket.io server
    (async function () {
      if (user?.id) {
        const socketURL =
          process.env.NODE_ENV === "production"
            ? "https://ichat-socket.onrender.com"
            : "http://localhost:3001";

        newSocket = io(socketURL, {
          query: { roomId: user?.id },
          auth: { token: process.env.NEXT_PUBLIC_API_ACCESS_TOKEN },
        });

        newSocket.on("connect", () => {
          setSocket?.(newSocket as Socket);
        });
      }
    })();

    return () => {
      newSocket?.close();
    };
  }, [user]);

  //receive message event listener
  React.useEffect(() => {
    const receiveMessageListener = (message: Message) => {
      const newMessages = chatMessages[message.chat]
        ? {
            ...chatMessages[message.chat],
            messages: [...chatMessages[message.chat].messages, message],
          }
        : { messages: [message] };

      setChatMessages?.((chatMessages) => ({
        ...chatMessages,
        [message.chat]: newMessages,
      }));

      // console.log("the chats are", chats);
      // console.log("the chat Messages are", chatMessages);
      const chatId = message.group ? message.id : message.sender;
      setChats((prev) => {
        const chat = structuredClone(prev[chatId]);
        delete prev[chatId];
        return {
          [chatId]: chat,
          ...prev,
        };
      });
    };
    socket?.on("receive-message", receiveMessageListener);
    return () => {
      socket?.off("receive-message", receiveMessageListener);
    };
  }, [
    chatMessages,
    chats,
    setChatMessages,
    setChats,
    setCurrentChat,
    socket,
    user,
  ]);

  return <SocketIoContext.Provider value={[socket, setSocket]} {...props} />;
}

export default SocketIoProvider;
