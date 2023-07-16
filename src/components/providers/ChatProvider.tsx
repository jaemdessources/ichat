import React from "react";
import useAppContext from "@/hooks/useAppContext";
import { UserContext, ChatContext } from "@/contexts";
import { Context, User, Chat, ChatWithInterlocutor } from "@/models";
import useFetchData from "@/hooks/useFetchData";

import userService from "@/services/userService";
export default function ChatProvider(props: any) {
  const [chats, setChats] = React.useState<{ [id: string]: ChatWithInterlocutor }>(
    {}
  );
  const [currentChat, setCurrentChat] = React.useState<Chat>();
  const [user] = useAppContext(UserContext) as Context<User>;
  const userId = user?.id as string;

  const {
    data: chatData,
    isError,
    isLoading,
  } = useFetchData<ChatWithInterlocutor[]>(
    { url: `/chats?userId=${userId}`, userId },
    userService.getChats
  );

  React.useEffect(() => {
    let formattedChats: { [id: string]: ChatWithInterlocutor } = {};

    chatData?.forEach((chat) => {
      if (chat.group) {
        chat.secondaryId = chat.id;
        formattedChats[chat.id] = chat;
      } else {
        chat.secondaryId = chat.interlocutorId as string;
        formattedChats[chat.interlocutorId as string] = chat;
      }
    });

    setChats(formattedChats);
  }, [chatData]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        currentChat,
        setCurrentChat,
        isError,
        isLoading,
      }}
      {...props}
    />
  );
}
