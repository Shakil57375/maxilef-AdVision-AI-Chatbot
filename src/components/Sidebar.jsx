import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import WholeWebsiteLoader from "./Loader/WholeWebsiteLoader";
import { useGetUserProfileQuery } from "../features/auth/authApi";
import shape1 from "../assets/Ellipse 7 (2).png";
import shape2 from "../assets/Ellipse 8 (1).png";
import shape3 from "../assets/Ellipse 9.png";
import { useChat } from "../context/ChatContext";
import userImage from "../assets/file (5).png";
import {
  useGetAllChatsQuery,
  useRenameChatMutation,
  useDeleteChatMutation,
} from "../features/chat/chatApi";
import { useGetSubscriptionDetailsQuery } from "../features/subscription/subscriptionApi";
import Swal from "sweetalert2";

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const user = useSelector((state) => state.auth.user);
  const { id: currentChatId } = useParams();
  const { data: userData, isLoading: isProfileLoading } = useGetUserProfileQuery();
  const { data: userSubscription } = useGetSubscriptionDetailsQuery();
  const { setCurrentChat, setCurrentChatId } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [editChatId, setEditChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [totalUserMessages, setTotalUserMessages] = useState(0);

  // Fetch chats using RTK Query
  const { data: chatsData, isLoading: isChatsLoading } = useGetAllChatsQuery();
  const [renameChat] = useRenameChatMutation();
  const [deleteChat] = useDeleteChatMutation();

  const chats = chatsData?.chatHistories || [];
  const isLoading = isChatsLoading || isProfileLoading;

  // Determine subscription status and total message count
  useEffect(() => {
    if (userSubscription?.subscription?.amount) {
      setIsPremiumUser(userSubscription.subscription.amount !== "$0.00");
    }
    if (chatsData?.chatHistories) {
      const totalMessages = chatsData.chatHistories.reduce((count, chat) => {
        return count + (chat.chat_contents || []).filter((msg) => msg.sent_by === "User").length;
      }, 0);
      setTotalUserMessages(totalMessages);
    }
  }, [userSubscription, chatsData]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredChats = chats?.filter((chat) =>
    chat.chat_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChatsByDate = (chats) => {
    const groupedChats = { today: [], yesterday: [], other: {} };
    chats?.forEach((chat) => {
      const chatDate = parseISO(chat.timestamp || new Date().toISOString());
      if (isToday(chatDate)) {
        groupedChats.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groupedChats.yesterday.push(chat);
      } else {
        const formattedDate = format(chatDate, "yyyy-MM-dd");
        if (!groupedChats.other[formattedDate]) {
          groupedChats.other[formattedDate] = [];
        }
        groupedChats.other[formattedDate].push(chat);
      }
    });
    groupedChats.today.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    groupedChats.yesterday.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    Object.keys(groupedChats.other).forEach((date) =>
      groupedChats.other[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    );
    return groupedChats;
  };

  const groupedChats = groupChatsByDate(filteredChats);

  const handleSaveEdit = async () => {
    if (editTitle.trim() === "") {
      toast.error("Chat name cannot be empty!", { duration: 1000 });
      return;
    }
    try {
      await renameChat({ chatId: editChatId, newTitle: editTitle }).unwrap();
      toast.success("Chat renamed successfully!", { duration: 1000 });
      setEditChatId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error renaming chat:", error);
      toast.error("Failed to rename chat. Please try again.", { duration: 1000 });
    }
  };

  const handleNewChat = async () => {
    if (!isPremiumUser && totalUserMessages >= 3) {
      Swal.fire({
        icon: "warning",
        title: "Message Limit Reached",
        text: "Free users are limited to 3 messages total. Upgrade to premium to start a new conversation!",
        showConfirmButton: true,
        confirmButtonText: "Upgrade Now",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/upgrade");
        }
      });
      return;
    }
    setCurrentChat([]);
    setCurrentChatId(null);
    navigate("/");
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId).unwrap();
      toast.success("Chat deleted successfully!", { duration: 1000 });
      if (chatId === currentChatId) navigate("/");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat.", { duration: 1000 });
    }
  };

  const handleChatClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const isChatEmpty = (groupedChats) =>
    groupedChats.today.length === 0 &&
    groupedChats.yesterday.length === 0 &&
    Object.keys(groupedChats.other).every((key) => groupedChats.other[key].length === 0);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <WholeWebsiteLoader />
      </div>
    );
  }

  return (
    <div
      className={`fixed lg:static z-50 top-20 bottom-0 h-[calc(100vh-80px)] ${
        isSidebarOpen ? "left-0 w-80" : "-left-full lg:w-full"
      } lg:left-0 bg-[#1F1F1F] dark:bg-gray-700 transition-all duration-300 ease-in-out !text-white`}
    >
      <div className="flex-grow overflow-y-auto">
        {isSidebarOpen && (
          <div className="bg-[#1F1F1F] dark:bg-gray-700 w-full">
            <button
              className={`py-3 px-[82px] rounded-md text-white text-center font-semibold flex items-center justify-center mx-auto mt-8 mb-3 ${
                !isPremiumUser && totalUserMessages >= 3
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FF00AA] to-[#01B9F9]"
              }`}
              onClick={handleNewChat}
              disabled={!isPremiumUser && totalUserMessages >= 3}
            >
              + New Chat
            </button>
            <div className="px-4 mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2 rounded-md bg-[#282A30] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#01B9F9]"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={clearSearch}
                  >
                    <span className="text-gray-400 hover:text-white">✕</span>
                  </button>
                )}
              </div>
            </div>
            <div className="px-4">
              <p className="text-xl font-bold my-1 text-white">
                {searchQuery ? "Search Results" : "Recent Plans"}
              </p>
              {user && (
                <div
                  className={`space-y-4 overflow-y-auto mt-4 ${
                    isPremiumUser
                      ? "2xl:h-[calc(100vh-300px)] xl:h-[calc(100vh-300px)] lg:h-[calc(100vh-300px)] h-[calc(100vh-350px)]"
                      : "2xl:h-[calc(100vh-600px)] xl:h-[calc(100vh-600px)] lg:h-[calc(100vh-600px)] h-[calc(100vh-600px)]"
                  }`}
                >
                  {isChatEmpty(groupedChats) ? (
                    <p className="text-gray-500 text-center">
                      {searchQuery ? "No matching plans found." : "No plans found."}
                    </p>
                  ) : (
                    <>
                      {groupedChats.today.length > 0 && (
                        <div>
                          <h2 className="text-white font-semibold text-lg">Today</h2>
                          {groupedChats.today.map((chat) => (
                            <div key={chat._id} className="relative flex items-center group">
                              {editChatId === chat._id ? (
                                <div className="flex items-center w-full pr-5">
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="p-2 rounded-md border border-gray-300 w-full dark:bg-gray-700 text-black"
                                    autoFocus
                                  />
                                  <button
                                    className="ml-2 p-2 bg-gradient-to-r from-[#FF00AA] to-[#01B9F9] text-white rounded"
                                    onClick={handleSaveEdit}
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <NavLink
                                  to={`/chat/${chat._id}`}
                                  className={({ isActive }) =>
                                    `flex-grow text-left p-2 rounded-md transition-colors mx-1 ${
                                      isActive
                                        ? "text-black bg-indigo-100 font-bold"
                                        : "hover:bg-gray-100 hover:text-black"
                                    }`
                                  }
                                  onClick={handleChatClick}
                                >
                                  {chat.chat_name || "Untitled Chat"}
                                </NavLink>
                              )}
                              <button
                                className="absolute right-0 p-1 rounded-full"
                                onClick={() =>
                                  setShowDropdown(showDropdown === chat._id ? null : chat._id)
                                }
                              >
                                <IoEllipsisVertical className="text-gray-500" size={18} />
                              </button>
                              {showDropdown === chat._id && (
                                <div
                                  className="absolute top-8 right-4 w-40 bg-white shadow-lg rounded-lg z-10"
                                  ref={dropdownRef}
                                >
                                  <button
                                    onClick={() => {
                                      setEditChatId(chat._id);
                                      setEditTitle(chat.chat_name);
                                      setShowDropdown(null);
                                    }}
                                    className="flex items-center space-x-2 p-2 text-gray-500 w-full"
                                  >
                                    🖋️ Rename
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChat(chat._id)}
                                    className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-red-100 hover:text-red-500 w-full"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {groupedChats.yesterday.length > 0 && (
                        <div>
                          <h2 className="text-white font-semibold text-lg">Yesterday</h2>
                          {groupedChats.yesterday.map((chat) => (
                            <div key={chat._id} className="relative flex items-center group">
                              {editChatId === chat._id ? (
                                <div className="flex items-center w-full pr-5">
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="p-2 rounded-md border border-gray-300 w-full dark:bg-gray-700 text-black"
                                    autoFocus
                                  />
                                  <button
                                    className="ml-2 p-2 bg-gradient-to-r from-[#FF00AA] to-[#01B9F9] text-white rounded"
                                    onClick={handleSaveEdit}
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <NavLink
                                  to={`/chat/${chat._id}`}
                                  className={({ isActive }) =>
                                    `flex-grow text-left p-2 rounded-md transition-colors mx-1 ${
                                      isActive
                                        ? "text-black bg-indigo-100 font-bold"
                                        : "hover:bg-gray-100 hover:text-black"
                                    }`
                                  }
                                  onClick={handleChatClick}
                                >
                                  {chat.chat_name || "Untitled Chat"}
                                </NavLink>
                              )}
                              <button
                                className="absolute right-0 p-1 rounded-full"
                                onClick={() =>
                                  setShowDropdown(showDropdown === chat._id ? null : chat._id)
                                }
                              >
                                <IoEllipsisVertical size={18} />
                              </button>
                              {showDropdown === chat._id && (
                                <div
                                  className="absolute top-8 right-4 w-40 bg-white shadow-lg rounded-lg z-10"
                                  ref={dropdownRef}
                                >
                                  <button
                                    onClick={() => {
                                      setEditChatId(chat._id);
                                      setEditTitle(chat.chat_name);
                                      setShowDropdown(null);
                                    }}
                                    className="flex items-center space-x-2 p-2 text-gray-500 w-full"
                                  >
                                    🖋️ Rename
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChat(chat._id)}
                                    className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-red-100 hover:text-red-500 w-full"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {Object.keys(groupedChats.other).length > 0 &&
                        Object.keys(groupedChats.other)
                          .sort((a, b) => new Date(b) - new Date(a))
                          .map((date) => (
                            <div key={date}>
                              <h2 className="text-white font-semibold text-lg">
                                {format(new Date(date), "MMMM d, yyyy")}
                              </h2>
                              {groupedChats.other[date].map((chat) => (
                                <div key={chat._id} className="relative flex items-center group">
                                  {editChatId === chat._id ? (
                                    <div className="flex items-center w-full pr-5">
                                      <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="p-2 rounded-md border border-gray-300 w-full dark:bg-gray-700 text-black"
                                        autoFocus
                                      />
                                      <button
                                        className="ml-2 p-2 bg-gradient-to-r from-[#FF00AA] to-[#01B9F9] text-white rounded"
                                        onClick={handleSaveEdit}
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <NavLink
                                      to={`/chat/${chat._id}`}
                                      className={({ isActive }) =>
                                        `flex-grow text-left p-2 rounded-md transition-colors mx-1 ${
                                          isActive
                                            ? "text-black bg-indigo-100 font-bold"
                                            : "hover:bg-gray-100 hover:text-black"
                                        }`
                                      }
                                      onClick={handleChatClick}
                                    >
                                      {chat.chat_name || "Untitled Chat"}
                                    </NavLink>
                                  )}
                                  <button
                                    className="absolute right-0 p-1 rounded-full"
                                    onClick={() =>
                                      setShowDropdown(showDropdown === chat._id ? null : chat._id)
                                    }
                                  >
                                    <IoEllipsisVertical size={18} />
                                  </button>
                                  {showDropdown === chat._id && (
                                    <div
                                      className="absolute top-8 right-4 w-40 bg-white shadow-lg rounded-lg z-10"
                                      ref={dropdownRef}
                                    >
                                      <button
                                        onClick={() => {
                                          setEditChatId(chat._id);
                                          setEditTitle(chat.chat_name);
                                          setShowDropdown(null);
                                        }}
                                        className="flex items-center space-x-2 p-2 text-gray-500 w-full"
                                      >
                                        🖋️ Rename
                                      </button>
                                      <button
                                        onClick={() => handleDeleteChat(chat._id)}
                                        className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-red-100 hover:text-red-800 w-full"
                                      >
                                        🗑️ Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isSidebarOpen && (
        <div className="flex flex-col text-white absolute bottom-5 max-w-sm mx-auto gap-2">
          {!isPremiumUser && (
            <div className="flex flex-col bg-[#0051FF] p-4 rounded-2xl relative">
              <img src={shape1} className="absolute top-0 right-0" alt="" />
              <img src={shape2} className="absolute top-8 right-0" alt="" />
              <img src={shape3} className="absolute bottom-0 left-0" alt="" />
              <h1 className="text-center w-full my-5 text-2xl font-bold">
                Update Your Plan
              </h1>
              <div className="text-center w-full mb-5">
                <p>Unlock powerful features</p>
                <p>with our pro upgrade today!</p>
              </div>
              <Link
                to={"/upgrade"}
                className="py-3 px-16 rounded-md bg-gradient-to-r from-[#FF00AA] to-[#01B9F9] text-white text-center font-semibold"
              >
                Upgrade To Pro
              </Link>
            </div>
          )}
          <Link
            to={"/editProfile"}
            className="flex items-center px-4 py-2 rounded-lg bg-[#282A30] gap-4"
          >
            <img
              src={user?.profileImage || userImage}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="mr-4 w-full text-center">{user?.name || "Guest"}</span>
          </Link>
        </div>
      )}
    </div>
  );
}