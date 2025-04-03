import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoEllipsisVertical, IoSave, IoSaveOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5"; // Added search icon
import { format, isToday, isYesterday } from "date-fns"; // For date manipulation
import {
  useGetChatsQuery,
  useRenameChatMutation,
  useSaveChatMutation,
  useDeleteChatMutation,
  useCreateChatMutation,
  useGetAllEditedChatsQuery,
} from "../features/chat/chatApi";
import { useChat } from "../context/ChatContext";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import WholeWebsiteLoader from "./Loader/WholeWebsiteLoader";
import { useGetUserProfileQuery } from "../features/auth/authApi";
import shape1 from "../assets/Ellipse 7 (2).png"
import shape2 from "../assets/Ellipse 8 (1).png"
import shape3 from "../assets/Ellipse 9.png"
export function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.accessToken); // Get token from Redux
  const {
    data: editedChats,
    isLoading: isEditedChatsLoading,
    refetch: refetchEditedChats,
  } = useGetAllEditedChatsQuery(undefined, {
    skip: !token, // Skip query if no token
  });

  const {
    data: userData,
    isLoading: isProfileLoading,
    refetch: refetchUserProfile,
  } = useGetUserProfileQuery();

  const {
    data: chats = [],
    isLoading,
    refetch,
  } = useGetChatsQuery(undefined, {
    skip: !token, // Skip query if no token
  });

  const [createChat] = useCreateChatMutation();
  const [renameChat] = useRenameChatMutation();
  const [saveChat] = useSaveChatMutation();
  const [deleteChat] = useDeleteChatMutation();

  const { setCurrentChat, setCurrentChatId } = useChat();
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(null);
  const [editChatId, setEditChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Added search state
  const [searchQuery, setSearchQuery] = useState("");

  // Refetch chats when token becomes available
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    refetchUserProfile();
  }, [refetchUserProfile, userData, token]);

  useEffect(() => {
    if (token) {
      refetchEditedChats();
    }
  }, [refetchEditedChats, token]);

  const handleToggleCloseButton = () => {
    const from = location.state?.from?.pathname || "/";
    navigate(from);
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Filter chats based on user selection and search query
  const filteredChats = chats?.filter((chat) => {
    // First apply category filter
    const categoryMatch =
      filter === "all"
        ? true
        : filter === "pinned"
        ? chat.is_pinned
        : filter === "saved"
        ? chat.is_saved
        : false;

    // Then apply search filter if there's a search query
    const searchMatch =
      searchQuery.trim() === ""
        ? true
        : (chat.chat_name || "Untitled Chat")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  if (isEditedChatsLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <WholeWebsiteLoader />
      </div>
    );

  // Group chats by date
  const groupChatsByDate = (chats) => {
    const groupedChats = {
      today: [],
      yesterday: [],
      other: {},
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.timestamp); // Assuming `timestamp` exists
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

    // Reverse the order of chats in each group
    groupedChats.today.reverse();
    groupedChats.yesterday.reverse();
    Object.keys(groupedChats.other).forEach((date) => {
      groupedChats.other[date].reverse();
    });

    return groupedChats;
  };

  const groupedChats = groupChatsByDate(filteredChats);

  const editedChatsByDate = (editedChats) => {
    const groupedChats = {
      today: [],
      yesterday: [],
      other: {},
    };

    editedChats?.forEach((chat) => {
      const chatDate = new Date(chat.timestamp); // Assuming `timestamp` exists
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

    // Reverse the order of chats in each group
    groupedChats.today.reverse();
    groupedChats.yesterday.reverse();
    Object.keys(groupedChats.other).forEach((date) => {
      groupedChats.other[date].reverse();
    });

    return groupedChats;
  };

  const editedChatsGrouped = editedChatsByDate(editedChats);

  // Rename Chat
  const handleSaveEdit = async () => {
    if (editTitle.trim() === "") {
      toast.error("Chat name cannot be empty!", { duration: 1000 });
      return;
    }

    try {
      // Trigger renameChat mutation with correct data
      await renameChat({ chatId: editChatId, newTitle: editTitle }).unwrap();

      toast.success("Chat renamed successfully!", { duration: 1000 });
      setEditChatId(null); // Reset editing state
      setEditTitle("");
    } catch (error) {
      console.error("Error renaming chat:", error);
      toast.error("Failed to rename chat. Please try again.", {
        duration: 1000,
      });
    }
  };

  // Handle New Chat
  const handleNewChat = async () => {
    setCurrentChat([]);
    navigate("/");
  };

  // Save Chat
  const handleSaveChat = async (chatId) => {
    try {
      await saveChat(chatId);
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  // Delete Chat
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      toast.success("Chat deleted successfully!", { duration: 1000 });
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat.", { duration: 1000 });
    }
  };

  const isChatEmpty = (groupedChats) => {
    const { today, yesterday, other } = groupedChats;
    return (
      today.length === 0 &&
      yesterday.length === 0 &&
      Object.keys(other).every((key) => other[key].length === 0)
    );
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <div
        className={`fixed lg:static z-50 top-0 bottom-0 h-screen  ${
          isSidebarOpen ? "left-0 w-80 " : "-left-full lg:w-full !md:w-full "
        } lg:left-0  bg-[#1F1F1F] dark:bg-gray-700  transition-all duration-300 ease-in-out !text-white`}
      >
        <div className="flex-grow overflow-y-auto">
          {isSidebarOpen && (
            <div className="bg-[#1F1F1F] dark:bg-gray-700 w-full">
              {/* New Chat Button */}
              <button
                className="py-3 px-[82px] rounded-md bg-gradient-to-r from-[#FF00AA] to-[#01B9F9] text-white text-center font-semibold mb-2 flex items-center justify-center mx-auto"
                onClick={handleNewChat}
              >
                + New Plan
              </button>

              {/* Search Input - Added */}
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

              {/* Filter Dropdown */}
              <div className="px-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold my-1 text-white">
                    {searchQuery ? "Search Results" : "Recent Plans"}
                  </p>
                </div>

                {/* Grouped Chats */}
                {user && (
                  <div className="space-y-4 2xl:h-[calc(100vh-400px)] h-[calc(100vh-280px)] overflow-y-auto mt-4">
                    {isChatEmpty(groupedChats) ? (
                      // Show "No chats found" if all groups are empty
                      <p className="text-gray-500 text-center">
                        {searchQuery
                          ? "No matching plans found."
                          : "No plans found."}
                      </p>
                    ) : (
                      <>
                        {/* Today */}
                        {groupedChats.today.length > 0 && (
                          <div>
                            <h2 className="text-white font-semibold text-lg">
                              Today
                            </h2>
                            {groupedChats.today.map((chat) => (
                              <div
                                key={chat.id}
                                className="relative flex items-center group"
                              >
                                {editChatId === chat.id ? (
                                  // Rename input
                                  <div className="flex items-center w-full pr-5">
                                    <input
                                      type="text"
                                      value={editTitle}
                                      onChange={(e) =>
                                        setEditTitle(e.target.value)
                                      }
                                      className="p-2 rounded-md border border-gray-300 w-full dark:text-white"
                                      autoFocus
                                    />
                                    <button
                                      className="ml-2 p-2 bg-custom-blue text-white rounded"
                                      onClick={handleSaveEdit}
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <NavLink
                                    to={`/chat/${chat.id}`}
                                    className={({ isActive }) =>
                                      `flex-grow text-left p-2 rounded-md transition-colors mx-1  ${
                                        isActive
                                          ? "text-black bg-indigo-100 font-bold"
                                          : "hover:bg-gray-100 hover:text-black"
                                      }`
                                    }
                                  >
                                    {chat.chat_name || "Untitled Chat"}
                                  </NavLink>
                                )}

                                {/* Dropdown */}
                                <button
                                  ref={dropdownRef}
                                  className="absolute right-0 p-1 rounded-full"
                                  onClick={() =>
                                    setShowDropdown(
                                      showDropdown === chat.id ? null : chat.id
                                    )
                                  }
                                >
                                  <IoEllipsisVertical size={18} />
                                </button>
                                {showDropdown === chat.id && (
                                  <div
                                    className="absolute top-8 right-4 w-40 bg-white shadow-lg rounded-lg z-10"
                                    ref={dropdownRef}
                                  >
                                    <button
                                      onClick={() => {
                                        setEditChatId(chat.id);
                                        setEditTitle(chat.chat_name);
                                        setShowDropdown(null);
                                      }}
                                      className="flex items-center space-x-2 p-2 text-gray-500 w-full"
                                    >
                                      🖋️ Rename
                                    </button>
                                    <button
                                      onClick={() => handleSaveChat(chat.id)}
                                      className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 hover:text-black w-full"
                                    >
                                      {chat.is_saved ? (
                                        <>
                                          <IoSave className="text-green-500" />
                                          <span>Saved</span>
                                        </>
                                      ) : (
                                        <>
                                          <IoSaveOutline />
                                          <span>Save</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteChat(chat.id)}
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

                        {/* Yesterday */}
                        {groupedChats.yesterday.length > 0 && (
                          <div>
                            <h2 className="text-white font-semibold text-lg">
                              Yesterday
                            </h2>
                            {groupedChats.yesterday.map((chat) => (
                              <div
                                key={chat.id}
                                className="relative flex items-center group"
                              >
                                {editChatId === chat.id ? (
                                  <div className="flex items-center w-full pr-5">
                                    <input
                                      type="text"
                                      value={editTitle}
                                      onChange={(e) =>
                                        setEditTitle(e.target.value)
                                      }
                                      className="p-2 rounded-md border border-gray-300 w-full dark:text-white"
                                      autoFocus
                                    />
                                    <button
                                      className="ml-2 p-2 bg-custom-blue text-white rounded"
                                      onClick={handleSaveEdit}
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <NavLink
                                    to={`/chat/${chat.id}`}
                                    className={({ isActive }) =>
                                      `flex-grow text-left p-2 rounded-md transition-colors mx-1 ${
                                        isActive
                                          ? "text-black bg-indigo-100 font-bold"
                                          : "hover:bg-gray-100 hover:text-black"
                                      }`
                                    }
                                  >
                                    {chat.chat_name || "Untitled Chat"}
                                  </NavLink>
                                )}

                                {/* Dropdown */}
                                <button
                                  ref={dropdownRef}
                                  className="absolute right-0 p-1 rounded-full"
                                  onClick={() =>
                                    setShowDropdown(
                                      showDropdown === chat.id ? null : chat.id
                                    )
                                  }
                                >
                                  <IoEllipsisVertical size={18} />
                                </button>
                                {showDropdown === chat.id && (
                                  <div
                                    className="absolute top-8 right-4 w-40 bg-white shadow-lg rounded-lg z-10"
                                    ref={dropdownRef}
                                  >
                                    <button
                                      onClick={() => {
                                        setEditChatId(chat.id);
                                        setEditTitle(chat.chat_name);
                                        setShowDropdown(null);
                                      }}
                                      className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 hover:text-black w-full"
                                    >
                                      🖋️ Rename
                                    </button>
                                    <button
                                      onClick={() => handleSaveChat(chat.id)}
                                      className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 hover:text-black w-full"
                                    >
                                      {chat.is_saved ? (
                                        <>
                                          <IoSave className="text-green-500" />
                                          <span>Saved</span>
                                        </>
                                      ) : (
                                        <>
                                          <IoSaveOutline />
                                          <span>Save</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteChat(chat.id)}
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

                        {/* Other Dates */}
                        {Object.keys(groupedChats.other).map((date) => (
                          <div key={date}>
                            <h2 className="text-white font-semibold text-lg">
                              {date}
                            </h2>
                            {groupedChats.other[date].map((chat) => (
                              <div
                                key={chat.id}
                                className="relative flex items-center group"
                              >
                                {editChatId === chat.id ? (
                                  <div className="flex items-center w-full pr-5">
                                    <input
                                      type="text"
                                      value={editTitle}
                                      onChange={(e) =>
                                        setEditTitle(e.target.value)
                                      }
                                      className="p-2 rounded-md border border-gray-300 w-full dark:text-white"
                                      autoFocus
                                    />
                                    <button
                                      className="ml-2 p-2 bg-custom-blue text-white rounded"
                                      onClick={handleSaveEdit}
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <NavLink
                                    to={`/chat/${chat.id}`}
                                    className={({ isActive }) =>
                                      `flex-grow text-left p-2 rounded-md transition-colors mx-1 ${
                                        isActive
                                          ? "text-black bg-indigo-100 font-bold"
                                          : "hover:bg-gray-100 hover:text-black"
                                      }`
                                    }
                                  >
                                    {chat.chat_name || "Untitled Chat"}
                                  </NavLink>
                                )}

                                {/* Dropdown */}
                                <button
                                  ref={dropdownRef}
                                  className="absolute right-0 p-1 rounded-full"
                                  onClick={() =>
                                    setShowDropdown(
                                      showDropdown === chat.id ? null : chat.id
                                    )
                                  }
                                >
                                  <IoEllipsisVertical size={18} />
                                </button>
                                {showDropdown === chat.id && (
                                  <div
                                    className="absolute top-8 right-4 w-40 bg-white shadow-lg rounded-lg z-10"
                                    ref={dropdownRef}
                                  >
                                    <button
                                      onClick={() => {
                                        setEditChatId(chat.id);
                                        setEditTitle(chat.chat_name);
                                        setShowDropdown(null);
                                      }}
                                      className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 hover:text-black w-full"
                                    >
                                      🖋️ Rename
                                    </button>
                                    <button
                                      onClick={() => handleSaveChat(chat.id)}
                                      className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 hover:text-black w-full"
                                    >
                                      {chat.is_saved ? (
                                        <>
                                          <IoSave className="text-green-500" />
                                          <span>Saved</span>
                                        </>
                                      ) : (
                                        <>
                                          <IoSaveOutline />
                                          <span>Save</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteChat(chat.id)}
                                      className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-red-100 hover:text-red-500 w-full"
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

        <div className="flex flex-col bg-[#1F1F1F] text-white absolute bottom-5 max-w-sm mx-auto gap-2 ">
          <div className="flex flex-col bg-[#0051FF] p-8 rounded-2xl relative">
            <img src={shape1} className="absolute top-0 right-0" alt="" />
            <img src={shape2} className="absolute top-8 right-0" alt="" />
            <img src={shape3} className="absolute bottom-0 left-0" alt="" />
            <h1 className="text-center w-full my-5 text-2xl font-bold">Update Your Plan</h1>
            <div className="text-center w-full mb-5">
              <p>Unlock powerful features </p>
              <p>with our pro upgrade today!</p>
            </div>
            {userData?.subscription_status === "not_subscribed" &&
              isSidebarOpen && (
                <Link
                  to={"/upgrade"}
                  onClick={handleToggleCloseButton}
                  className="py-3 px-16 rounded-md bg-gradient-to-r from-[#FF00AA] to-[#01B9F9] text-white text-center font-semibold"
                >
                  Upgrade To Pro
                </Link>
              )}
          </div>
          <Link to={"/editProfile"} className="flex items-center px-4 py-2 rounded-lg bg-[#282A30] gap-4 ">
            <img
              src={`https://backend.gameplanai.co.uk${user?.profile_picture}`}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="mr-4 w-full text-center">
              {user?.name || "Guest"}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
