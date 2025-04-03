import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetChatContentsQuery,
  useAddMessageToChatMutation,
  useCreateChatMutation,
} from "../features/chat/chatApi";
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

export function ChatArea() {
  const { id: currentChatId } = useParams();
  const { setCurrentChat, setCurrentChatId } = useChat();
  const navigate = useNavigate();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  // Redux Selector for User
  const user = useSelector(selectUser);
  const {
    data: chatData,
    isLoading,
    refetch: refetchChatContents,
  } = useGetChatContentsQuery(currentChatId, {
    skip: !currentChatId || !user, // Skip if no chat ID or user
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const emailHash = user?.email
    ? md5(user.email.trim().toLowerCase())
    : "default";

  // Get chat ID from URL params
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showEditAndPinButton, setShowEditAndPinButton] = useState(false);

  const [addMessageToChat, { isLoading: isSendingMessage }] =
    useAddMessageToChatMutation();
  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
  const [showText, setShowText] = useState(false); // Control text display
  const timerRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEditAndPinButton(false);
      }
    };

    if (showEditAndPinButton) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEditAndPinButton]);

  // Smooth scrolling to the bottom of the chat
  const smoothScrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const start = chatContainer.scrollTop;
    const end = chatContainer.scrollHeight;
    const duration = 2000; // Animation duration in milliseconds
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Clamp progress to [0, 1]
      chatContainer.scrollTop = start + (end - start) * progress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Sync `chatMessages` with server data
  useEffect(() => {
    if (chatData?.chat_contents) {
      setChatMessages(chatData.chat_contents);
    }
  }, [chatData]);

  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      smoothScrollToBottom();
    }
  }, [chatMessages]);

  // Focus on input field when it re-renders
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    if (isAiLoading) {
      return;
    }
    e.preventDefault();
    setIsAiLoading(true); // Start loader

    if (!input.trim()) return;

    // Handle new chat creation
    if (!currentChatId) {
      try {
        setChatMessages([
          {
            manual_id: Date.now(),
            sent_by: "User",
            text_content: input,
          },
        ]); // Add message optimistically
        const response = await createChat(input).unwrap();
        setCurrentChatId(response.id);
        setChatMessages(response.chat_contents);
        navigate(`/chat/${response.id}`);
        smoothScrollToBottom();
        setInput("");
      } catch (error) {
        console.error("Error creating chat:", error);
        // Show SweetAlert2 dialog
        Swal.fire({
          title: "Access denied",
          text:
            error?.data?.Message ||
            "An error occurred while sending the message.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Upgrade",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to the upgrade modal
            navigate("/upgrade");
          }
        });
      } finally {
        setIsAiLoading(false); // Stop loader
      }
    } else {
      // Handle adding a message to an existing chat
      const optimisticMessage = {
        id: Date.now(),
        text_content: input,
        sent_by: "User",
      };

      setChatMessages((prev) => [...prev, optimisticMessage]); // Optimistic update
      setInput("");

      try {
        await addMessageToChat({
          chatId: currentChatId,
          message: input,
        }).unwrap();
        refetchChatContents(); // Sync with server
      } catch (error) {
        console.error("Error sending message:", error?.data?.Message);

        // Show SweetAlert2 dialog
        Swal.fire({
          title: "Access denied",
          text:
            error?.data?.Message ||
            "An error occurred while sending the message.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Upgrade",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to the upgrade modal
            navigate("/upgrade");
          }
        });

        // Remove optimistic message on error
        setChatMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id)
        );
      } finally {
        setIsAiLoading(false); // Stop loader
      }
    }
  };

  const handleAttachClick = () => {};

  const handleFileChange = () => {};

  useEffect(() => {
    if (chatMessages.length === 0 && !showText) {
      timerRef.current = setTimeout(() => {
        setShowText(true);
      }, 100);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [chatMessages, showText]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] dark:bg-gray-800 dark:text-white">
      {/* Chat Messages */}
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <WholeWebsiteLoader />
        </div>
      ) : (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {!chatMessages[0]?.manual_id && !currentChatId ? (
            <div>
              <h1 className="text-2xl font-bold my-6 text-white text-center">
                I am your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#3b82f6] mx-2">
                  virtual ads assistant
                </span>
                ready when you are!
              </h1>
              <div className="w-full max-w-2xl p-8 rounded-3xl bg-zinc-900 text-white flex items-center justify-center flex-col  mx-auto ">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_2025_03_15T02_18_52_369Z%20%5BConverted%5D-01%20%281%29%202-SeEkhgHsnKbwKMoRbJmgbGRalgd52L.png"
                    alt="AdFusion Labs Logo"
                    className="h-12"
                  />
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl font-bold text-center mb-4">
                  Ask me anything
                  I&apos;ll do my best to help.
                </h1>

                {/* Description */}
                <p className="text-center text-zinc-400 mb-8 max-w-lg mx-auto">
                  Get expert guidance powered by AI agents specializing in
                  Sales, Marketing, and Negotiation. While I provide data-driven
                  insights and strategic recommendations, remember that I&apos;m
                  just a robot! Always verify information and make informed
                  decisions before implementing any advice.
                </p>

                {/* Image Upload Section */}
                <div className="border border-blue-800 rounded-lg p-4 mb-8 max-w-md mx-auto cursor-not-allowed">
                  <div className="flex flex-col items-center">
                    <label htmlFor="image-upload" className=" mb-2">
                      <span className="text-white font-medium">
                        Upload Image
                      </span>
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
                  key={message.id}
                  className={`flex ${
                    message.sent_by === "User"
                      ? "flex-row-reverse items-center gap-2"
                      : "flex-row"
                  }`}
                >
                  {message.sent_by === "Bot" ? (
                    <>
                      {/* AI Image */}
                      {/* <img
                        src={AiImage}
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
                      message.sent_by === "Bot"
                        ? "bg-transparent text-white"
                        : "bg-[#0051FF80] text-white"
                    }`}
                  >
                    <RichTextDisplay content={message.text_content} />
                  </div>
                </div>
              ))}

              {/* AI Loader Placeholder */}
              {isAiLoading && (
                <div className="flex items-center gap-2">
                  {/* <img
                    src={AiImage}
                    alt="AI"
                    className="w-8 h-8 rounded-full"
                  /> */}
                  <Loader />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 flex items-center border-t relative bottom-0 "
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* File upload button */}
        <button
          type="button"
          onClick={handleAttachClick}
          className="p-3  absolute right-16 z-10"
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
              e.preventDefault(); // Prevent new line
              handleSubmit(e); // Trigger form submission
            }
          }}
          ref={inputRef} // Attach ref to textarea
          placeholder="Type your message (Shift + Enter for new line)"
          autoComplete="off" // Disable auto-complete for security reasons
          rows={1} // Initial rows
          className="flex-1 p-3 py-5 border dark:border-gray-600 dark:placeholder:text-gray-100 rounded-lg resize-none focus:outline-none focus:ring focus:border-indigo-500  dark:bg-gray-700 dark:text-white placeholder:text-sm"
          style={{ overflow: "hidden" }} // Disable scroll for smooth resizing
        />

        {/* Submit button */}
        <button
          type="submit"
          className={`ml-4 p-3 rounded-full absolute right-4 cursor-pointer ${
            isAiLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : " text-white"
          }`}
          disabled={
            isAiLoading || isSendingMessage || !input.trim() || isLoading
          }
        >
          <IoSendSharp className="text-3xl text-black dark:text-white" />
        </button>
      </form>
    </div>
  );
}
