import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useGetChatsQuery,
  useCreateChatMutation,
  useAddMessageToChatMutation,
  usePinChatMutation,
  useUnpinChatMutation,
  useDeleteChatMutation,
  useSaveChatMutation,
  useRenameChatMutation,
  useGetChatContentsQuery,
} from "../features/chat/chatApi";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [showActionButton, setShowActionButton] = useState(false);

  const user = useSelector(selectUser);

  const { data: chats = [], isLoading: isChatsLoading } = useGetChatsQuery();

  const { 
    data: chatMessages = [], 
    refetch: refetchChatContents,
    isSuccess: isChatContentsQuerySuccess
  } = useGetChatContentsQuery(currentChatId, {
    skip: !currentChatId || !user,
  });

  useEffect(() => {
    if (currentChatId) {
      const selectedChat = chats?.find((chat) => chat.id === currentChatId);
      setCurrentChat(selectedChat || null);
    } else {
      setCurrentChat(null);
    }
  }, [currentChatId, chats]);

  const [createChat] = useCreateChatMutation();
  const [addMessageToChat] = useAddMessageToChatMutation();
  const [pinChat] = usePinChatMutation();
  const [unpinChat] = useUnpinChatMutation();
  const [deleteChat] = useDeleteChatMutation();
  const [saveChat] = useSaveChatMutation();
  const [renameChat] = useRenameChatMutation();

  const handleCreateChat = async (message) => {
    try {
      const response = await createChat(message).unwrap();
      setCurrentChatId(response.id);
      return response.id;
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleAddMessageToChat = async (chatId, message) => {
    try {
      await addMessageToChat({ chatId, message });
      if (isChatContentsQuerySuccess) {
        refetchChatContents();
      }
    } catch (error) {
      console.error(`Error adding message to chat ID ${chatId}:`, error);
    }
  };

  const handlePinChat = async (chatId, pinDate) => {
    try {
      await pinChat({ chatId, pinDate });
    } catch (error) {
      console.error(`Error pinning chat ID ${chatId}:`, error);
    }
  };

  const handleUnpinChat = async (chatId) => {
    try {
      await unpinChat(chatId);
    } catch (error) {
      console.error(`Error unpinning chat ID ${chatId}:`, error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      if (currentChatId === chatId) {
        handleClearId();
      }
    } catch (error) {
      console.error(`Error deleting chat ID ${chatId}:`, error);
    }
  };

  const handleSaveChat = async (chatId) => {
    try {
      await saveChat(chatId);
    } catch (error) {
      console.error(`Error saving chat ID ${chatId}:`, error);
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await renameChat({ chatId, newTitle });
    } catch (error) {
      console.error(`Error renaming chat ID ${chatId}:`, error);
    }
  };

  const handleClearId = () => {
    setCurrentChatId(null);
    setCurrentChat(null);
  };

  const safeRefetchChatContents = () => {
    if (isChatContentsQuerySuccess) {
      refetchChatContents();
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        chatMessages,
        currentChatId,
        setCurrentChatId,
        currentChat,
        setCurrentChat,
        showActionButton,
        setShowActionButton,
        isChatsLoading,
        handleCreateChat,
        handleAddMessageToChat,
        handlePinChat,
        handleUnpinChat,
        handleDeleteChat,
        handleSaveChat,
        handleRenameChat,
        handleClearId,
        safeRefetchChatContents,
        isChatContentsQuerySuccess,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

