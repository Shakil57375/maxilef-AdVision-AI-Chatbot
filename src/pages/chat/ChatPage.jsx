import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar.JSX';
import ChatArea from '../../components/ChatArea.JSX';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { toggleSettings, selectIsSettingsOpen, setActiveModal } from '../../features/chat/chatSlice';

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSettingsOpen = useSelector(selectIsSettingsOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, navigate]);

  // Handle settings menu options
  const handleSettingsOption = (option) => {
    dispatch(setActiveModal(option));
    dispatch(toggleSettings());
  };

  return (
    <div className="flex h-screen bg-[#0a0b1a]">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-80' : 'lg:ml-16'
        }`}
      >
        {/* Header */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => dispatch(toggleSettings())}
            className="text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {isSettingsOpen && (
            <div className="absolute top-12 right-4 bg-[#2a2b3a] rounded-lg p-2">
              <button
                onClick={() => handleSettingsOption('help')}
                className="block w-full text-left text-white py-1 hover:bg-blue-600 rounded"
              >
                Help and Support
              </button>
              <button
                onClick={() => handleSettingsOption('subscriptions')}
                className="block w-full text-left text-white py-1 hover:bg-blue-600 rounded"
              >
                Manage Subscriptions
              </button>
              <button
                onClick={() => handleSettingsOption('terms')}
                className="block w-full text-left text-white py-1 hover:bg-blue-600 rounded"
              >
                Terms & Conditions
              </button>
              <button
                onClick={() => handleSettingsOption('privacy')}
                className="block w-full text-left text-white py-1 hover:bg-blue-600 rounded"
              >
                Privacy Policy
              </button>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatPage;