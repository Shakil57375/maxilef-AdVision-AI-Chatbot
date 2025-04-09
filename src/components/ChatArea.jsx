"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoAttach, IoSendSharp } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import WholeWebsiteLoader from "./Loader/WholeWebsiteLoader";
import { useSelector } from "react-redux";
import { useChat } from "../context/ChatContext";
import Swal from "sweetalert2";
import { selectUser } from "../features/auth/authSlice";
import Loader from "./Loader";
import md5 from "md5";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./ChatArea.css";
import { RichTextDisplay } from "./Modals/RichTextDisplay";
import axios from "axios";
import toast from "react-hot-toast";
import { useGetAllChatsQuery } from "../features/chat/chatApi";

export function ChatArea() {
  const { id: currentChatId } = useParams();
  const {
    setCurrentChat,
    currentChatId: contextChatId,
    setCurrentChatId,
  } = useChat();
  const {
    data: chatsData,
    refetch,
    isLoading: isChatsLoading,
  } = useGetAllChatsQuery();
  const navigate = useNavigate();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const user = useSelector(selectUser);
  const token = useSelector((state) => state.auth.accessToken);

  const emailHash = user?.email
    ? md5(user.email.trim().toLowerCase())
    : "default";
  const [input, setInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch chat by ID with token
  const fetchChatById = async (chatId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.10.198:5006/api/chatbot/history/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const chatData = response.data.chatHistory;
      setChatMessages(chatData.chat_contents || []);
      setCurrentChat(chatData);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error("Error fetching chat:", error);
      setChatMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync chatMessages with currentChatId
  useEffect(() => {
    if (currentChatId && token) {
      fetchChatById(currentChatId);
    } else {
      setChatMessages([]);
      setCurrentChat([]);
    }
  }, [currentChatId, token]);

  const smoothScrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const start = chatContainer.scrollTop;
    const end = chatContainer.scrollHeight;
    const duration = 2000;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      chatContainer.scrollTop = start + (end - start) * progress;
      if (progress < 1) requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    if (chatContainerRef.current) smoothScrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length + selectedImages.length > 3) {
      toast.error("You can only upload up to 3 images at a time.", {
        duration: 2000,
      });
      return;
    }

    if (files.length !== imageFiles.length) {
      toast.error("Only image files are allowed.", { duration: 2000 });
    }

    setSelectedImages((prev) => [...prev, ...imageFiles].slice(0, 3));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() && selectedImages.length === 0) return;

    const tempMessageId = `temp-${Date.now()}`;
    const userMessage = {
      _id: tempMessageId,
      sent_by: "User",
      text_content: input,
      timestamp: new Date().toISOString(),
    };

    // Add user message instantly
    setChatMessages((prev) =>
      currentChatId ? [...prev, userMessage] : [userMessage]
    );
    setInput("");
    setIsAiLoading(true);

    setTimeout(() => smoothScrollToBottom(), 50);

    try {
      let imageUrls = [];
      if (selectedImages.length > 0) {
        // Convert images to base64 strings
        imageUrls = await Promise.all(
          selectedImages.map(
            (file) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              })
          )
        );
      }

      const response = await axios.post(
        "http://192.168.10.198:5006/api/chatbot/message",
        {
          chatId: currentChatId || undefined,
          userMessage: userMessage.text_content,
          imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;
      if (result.chatHistory) {
        const newChatId = result.chatHistory._id;
        const aiResponse = {
          _id: `ai-${Date.now()}`,
          sent_by: "Bot",
          text_content:
            result.chatHistory.chat_contents?.find(
              (msg) => msg.sent_by === "Bot"
            )?.text_content || "Response received",
          timestamp: new Date().toISOString(),
        };

        // Update messages immediately
        setChatMessages((prev) =>
          currentChatId
            ? [
                ...prev.filter((msg) => msg._id !== tempMessageId),
                userMessage,
                aiResponse,
              ]
            : [userMessage, aiResponse]
        );
        setCurrentChatId(newChatId);
        setCurrentChat(result.chatHistory);

        if (!currentChatId) {
          navigate(`/chat/${newChatId}`);
        }
        refetch(); // Refetch chats to update the list
      }

      setSelectedImages([]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) =>
        prev.filter((msg) => msg._id !== tempMessageId)
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to send message. Please try again.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const thinkingMessages = [
    "Thinking...",
    "Analyzing...",
    "Processing...",
    "Generating response...",
  ];
  const [currentThinkingMessage, setCurrentThinkingMessage] = useState(
    thinkingMessages[0]
  );

  useEffect(() => {
    if (isAiLoading) {
      const interval = setInterval(() => {
        setCurrentThinkingMessage(
          thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]
        );
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isAiLoading]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] dark:bg-gray-800 dark:text-white">
      {isLoading && !chatMessages.length ? (
        <div className="w-full h-screen flex items-center justify-center">
          <WholeWebsiteLoader />
        </div>
      ) : (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chatMessages.length === 0 && !currentChatId ? (
            <div>
              <h1 className="text-2xl font-bold my-6 text-white text-center">
                I am your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#3b82f6] mx-2">
                  virtual ads assistant
                </span>
                ready when you are!
              </h1>
              <div className="w-full max-w-2xl p-8 rounded-3xl bg-zinc-900 text-white flex items-center justify-center flex-col mx-auto">
                <div className="flex justify-center mb-8">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_2025_03_15T02_18_52_369Z%20%5BConverted%5D-01%20%281%29%202-SeEkhgHsnKbwKMoRbJmgbGRalgd52L.png"
                    alt="AdFusion Labs Logo"
                    className="h-12"
                  />
                </div>
                <h1 className="text-3xl font-bold text-center mb-4">
                  Ask me anything I'll do my best to help.
                </h1>
                <p className="text-center text-zinc-400 mb-8 max-w-lg mx-auto">
                  Get expert guidance powered by AI agents specializing in
                  Sales, Marketing, and Negotiation. While I provide data-driven
                  insights and strategic recommendations, remember that I'm just
                  a robot! Always verify information and make informed decisions
                  before implementing any advice.
                </p>
                <div className="border border-blue-800 rounded-lg p-4 mb-8 max-w-md mx-auto">
                  <div className="flex flex-col items-center">
                    <label htmlFor="image-upload" className="mb-2">
                      <span className="text-white font-medium">
                        Upload Images (up to 3)
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((message) => (
                <div
                  key={message.id || message._id}
                  className={`flex ${
                    message.sent_by === "User"
                      ? "flex-row-reverse items-center gap-2"
                      : "flex-row"
                  }`}
                >
                  {message.sent_by === "User" && (
                    <Link to={"/editProfile"}>{/* User image logic */}</Link>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.sent_by === "Bot"
                        ? "bg-transparent text-white"
                        : "bg-[#0051FF80] text-white"
                    }`}
                  >
                    <RichTextDisplay content={message.text_content} />
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex flex-col rounded-lg p-4 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <Loader />
                    <span className="text-white text-opacity-80">
                      {currentThinkingMessage}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-4 flex items-center border-t relative bottom-0"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
          multiple
        />
        <button
          type="button"
          onClick={handleAttachClick}
          className="p-3 absolute right-16 z-10"
          disabled={isAiLoading || isLoading}
        >
          <IoAttach className="text-3xl" />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          ref={inputRef}
          placeholder="Type your message (Shift + Enter for new line)"
          autoComplete="off"
          rows={1}
          className="flex-1 p-3 py-5 border dark:border-gray-600 dark:placeholder:text-gray-100 rounded-lg resize-none focus:outline-none focus:ring focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder:text-sm"
          style={{ overflow: "hidden" }}
        />
        <button
          type="submit"
          className={`ml-4 p-3 rounded-full absolute right-4 cursor-pointer ${
            isAiLoading ||
            isLoading ||
            (!input.trim() && selectedImages.length === 0)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white"
          }`}
          disabled={
            isAiLoading ||
            isLoading ||
            (!input.trim() && selectedImages.length === 0)
          }
        >
          <IoSendSharp className="text-3xl text-black dark:text-white" />
        </button>
        {selectedImages.length > 0 && (
          <div className="absolute bottom-20 left-4 right-4 bg-gray-800 rounded-lg p-2">
            <p className="text-sm text-white mb-2">
              Selected images ({selectedImages.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded px-2 py-1 text-xs text-white flex items-center"
                >
                  {image.name}
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-white"
                    onClick={() => {
                      const newImages = [...selectedImages];
                      newImages.splice(index, 1);
                      setSelectedImages(newImages);
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
  );
}
