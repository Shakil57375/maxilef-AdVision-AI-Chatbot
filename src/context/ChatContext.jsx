
import { createContext, useContext, useState } from "react"

const ChatContext = createContext()

export const useChat = () => {
  return useContext(ChatContext)
}

export const ChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const value = {
    currentChat,
    setCurrentChat,
    currentChatId,
    setCurrentChatId,
    isEditMode,
    setIsEditMode,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
