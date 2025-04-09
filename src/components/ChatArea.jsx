"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IoAttach, IoSendSharp } from "react-icons/io5"
import "react-datepicker/dist/react-datepicker.css"
import WholeWebsiteLoader from "./Loader/WholeWebsiteLoader"
import { useSelector } from "react-redux"
import { useChat } from "../context/ChatContext"
import Swal from "sweetalert2"
import { selectUser } from "../features/auth/authSlice"
import Loader from "./Loader"
import md5 from "md5"
import "react-datetime-picker/dist/DateTimePicker.css"
import "react-calendar/dist/Calendar.css"
import "react-clock/dist/Clock.css"
import "./ChatArea.css"
import { RichTextDisplay } from "./Modals/RichTextDisplay"
import { useGetChatByIdQuery, useSendMessageMutation, useUploadChatFilesMutation  } from "../features/chat/chatApi"

export function ChatArea() {
  const { id: currentChatId } = useParams()
  const { setCurrentChat, setCurrentChatId } = useChat()
  const navigate = useNavigate()
  const [isAiLoading, setIsAiLoading] = useState(false)
  const dropdownRef = useRef(null)
  const fileInputRef = useRef(null)
  // Redux Selector for User
  const user = useSelector(selectUser)

  // Get chat data from API
  const {
    data: chatData,
    isLoading,
    refetch: refetchChat,
  } = useGetChatByIdQuery(currentChatId, {
    skip: !currentChatId,
  })

  // Mutations
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation()
  const [uploadFiles] = useUploadChatFilesMutation()

  const emailHash = user?.email ? md5(user.email.trim().toLowerCase()) : "default"

  // Get chat ID from URL params
  const [input, setInput] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const inputRef = useRef(null)
  const chatContainerRef = useRef(null)
  const [showEditAndPinButton, setShowEditAndPinButton] = useState(false)

  const [showText, setShowText] = useState(false) // Control text display
  const timerRef = useRef(null)
  const [chatMessages, setChatMessages] = useState([])

  // Update chat messages when data changes
  useEffect(() => {
    if (chatData?.chatHistory?.chat_contents) {
      setChatMessages(chatData.chatHistory.chat_contents)
      setCurrentChat(chatData.chatHistory)
      setCurrentChatId(currentChatId)
    } else {
      setChatMessages([])
    }
  }, [chatData, currentChatId, setCurrentChat, setCurrentChatId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEditAndPinButton(false)
      }
    }

    if (showEditAndPinButton) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showEditAndPinButton])

  // Smooth scrolling to the bottom of the chat
  const smoothScrollToBottom = () => {
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return

    const start = chatContainer.scrollTop
    const end = chatContainer.scrollHeight
    const duration = 2000 // Animation duration in milliseconds
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1) // Clamp progress to [0, 1]
      chatContainer.scrollTop = start + (end - start) * progress

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      smoothScrollToBottom()
    }
  }, [chatMessages])

  // Focus on input field when it re-renders
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim() && selectedFiles.length === 0) return

    // Create a temporary message ID
    const tempMessageId = `temp-${Date.now()}`

    // Create a temporary user message to display immediately
    const userMessage = {
      _id: tempMessageId,
      sent_by: "User",
      text_content: input,
      timestamp: new Date().toISOString(),
    }

    // Add the user message to the chat immediately
    setChatMessages((prevMessages) => [...prevMessages, userMessage])

    // Clear input field and scroll to bottom
    setInput("")
    setTimeout(() => smoothScrollToBottom(), 50)

    try {
      setIsAiLoading(true)

      // Add thinking indicators
      const thinkingMessages = [
        "Analyzing your request...",
        "Processing information...",
        "Generating insights...",
        "Thinking...",
      ]

      // Set a random thinking message
      const randomThinkingMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]

      // Handle file uploads if any
      let fileUrls = []
      if (selectedFiles.length > 0) {
        const formData = new FormData()
        selectedFiles.forEach((file) => {
          formData.append("files", file)
        })

        const uploadResult = await uploadFiles(formData).unwrap()
        fileUrls = uploadResult.fileUrls || []
      }

      // Send the message
      const result = await sendMessage({
        chatId: currentChatId,
        userMessage: userMessage.text_content,
        fileUrls: fileUrls.length > 0 ? fileUrls : undefined,
      }).unwrap()

      // If this is a new chat, navigate to the chat page with the new ID
      if (result.chatHistory && !currentChatId) {
        navigate(`/chat/${result.chatHistory._id}`)
      }

      // Clear files
      setSelectedFiles([])

      // Refetch chat data to get the latest messages
      if (currentChatId) {
        refetchChat()
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove the temporary message on error
      setChatMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== tempMessageId))

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to send message. Please try again.",
      })
    } finally {
      setIsAiLoading(false)
    }
  }

  // Add this function after the other useEffect hooks
  const addOptimisticMessage = (content, type = "User") => {
    const newMessage = {
      _id: `temp-${Date.now()}`,
      sent_by: type,
      text_content: content,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prevMessages) => [...prevMessages, newMessage])
    return newMessage._id
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] dark:bg-gray-800 dark:text-white">
      {/* Chat Messages */}
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <WholeWebsiteLoader />
        </div>
      ) : (
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {!chatMessages[0]?.manual_id && !currentChatId ? (
            <div>
              <h1 className="text-2xl font-bold my-6 text-white text-center">
                I am your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#3b82f6] mx-2">
                  virtual ads assistant
                </span>
                ready when you are!
              </h1>
              <div className="w-full max-w-2xl p-8 rounded-3xl bg-zinc-900 text-white flex items-center justify-center flex-col mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_2025_03_15T02_18_52_369Z%20%5BConverted%5D-01%20%281%29%202-SeEkhgHsnKbwKMoRbJmgbGRalgd52L.png"
                    alt="AdFusion Labs Logo"
                    className="h-12"
                  />
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl font-bold text-center mb-4">Ask me anything I&apos;ll do my best to help.</h1>

                {/* Description */}
                <p className="text-center text-zinc-400 mb-8 max-w-lg mx-auto">
                  Get expert guidance powered by AI agents specializing in Sales, Marketing, and Negotiation. While I
                  provide data-driven insights and strategic recommendations, remember that I&apos;m just a robot!
                  Always verify information and make informed decisions before implementing any advice.
                </p>

                {/* Image Upload Section */}
                <div className="border border-blue-800 rounded-lg p-4 mb-8 max-w-md mx-auto cursor-not-allowed">
                  <div className="flex flex-col items-center">
                    <label htmlFor="image-upload" className="mb-2">
                      <span className="text-white font-medium">Upload Image</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden cursor-not-allowed"
                        disabled
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Render Chat Messages */}
              {chatMessages.map((message) => (
                <div
                  key={message.id || message._id}
                  className={`flex ${message.sent_by === "User" ? "flex-row-reverse items-center gap-2" : "flex-row"}`}
                >
                  {message.sent_by === "Bot" ? (
                    <>
                      {/* AI Image */}
                      {/* <img
                        src={AiImage || "/placeholder.svg"}
                        alt="AI"
                        className="w-8 h-8 rounded-full mr-2"
                      /> */}
                      {/* Show AI Loader while response is being generated */}
                      {/* {isAiLoading && <Loader />} */}
                    </>
                  ) : (
                    <Link to={"/editProfile"}>
                      {/* <img
                        src={
                          user?.profile_picture
                            ? `https://backend.gameplanai.co.uk${user.profile_picture}`
                            : userImage
                        }
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                      /> */}
                    </Link>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.sent_by === "Bot" ? "bg-transparent text-white" : "bg-[#0051FF80] text-white"
                    }`}
                  >
                    <RichTextDisplay content={message.text_content} />
                  </div>
                </div>
              ))}

              {/* AI Loader Placeholder */}
              {isAiLoading && (
                <div className="flex flex-col bg-gray-800 bg-opacity-30 rounded-lg p-4 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <Loader />
                    <span className="text-white text-opacity-80">
                      {
                        ["Thinking...", "Analyzing...", "Processing...", "Generating response..."][
                          Math.floor(Math.random() * 4)
                        ]
                      }
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 flex items-center border-t relative bottom-0">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />

        {/* File upload button */}
        <button
          type="button"
          onClick={handleAttachClick}
          className="p-3 absolute right-16 z-10"
          disabled={isAiLoading || isSendingMessage || isLoading}
        >
          <IoAttach className="text-3xl" />
        </button>

        {/* Textarea for user input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault() // Prevent new line
              handleSubmit(e) // Trigger form submission
            }
          }}
          ref={inputRef} // Attach ref to textarea
          placeholder="Type your message (Shift + Enter for new line)"
          autoComplete="off" // Disable auto-complete for security reasons
          rows={1} // Initial rows
          className="flex-1 p-3 py-5 border dark:border-gray-600 dark:placeholder:text-gray-100 rounded-lg resize-none focus:outline-none focus:ring focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder:text-sm"
          style={{ overflow: "hidden" }} // Disable scroll for smooth resizing
        />

        {/* Submit button */}
        <button
          type="submit"
          className={`ml-4 p-3 rounded-full absolute right-4 cursor-pointer ${
            isAiLoading || isSendingMessage || (!input.trim() && selectedFiles.length === 0)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white"
          }`}
          disabled={isAiLoading || isSendingMessage || (!input.trim() && selectedFiles.length === 0) || isLoading}
        >
          <IoSendSharp className="text-3xl text-black dark:text-white" />
        </button>

        {/* Selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="absolute bottom-20 left-4 right-4 bg-gray-800 rounded-lg p-2">
            <p className="text-sm text-white mb-2">Selected files ({selectedFiles.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="bg-gray-700 rounded px-2 py-1 text-xs text-white flex items-center">
                  {file.name}
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-white"
                    onClick={() => {
                      const newFiles = [...selectedFiles]
                      newFiles.splice(index, 1)
                      setSelectedFiles(newFiles)
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
