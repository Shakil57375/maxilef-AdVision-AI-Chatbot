import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [], // Array of chat objects: { id, title, messages }
  currentChatId: null, // ID of the currently selected chat
  searchQuery: '', // For chat title search
  isSettingsOpen: false, // For settings menu
  activeModal: null, // For modals: 'subscriptions', 'terms', 'privacy', 'help'
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (state, action) => {
      state.chats.push(action.payload);
      state.currentChatId = action.payload.id;
    },
    deleteChat: (state, action) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
      if (state.currentChatId === action.payload) {
        state.currentChatId = state.chats.length > 0 ? state.chats[0].id : null;
      }
    },
    editChatTitle: (state, action) => {
      const { chatId, newTitle } = action.payload;
      const chat = state.chats.find(chat => chat.id === chatId);
      if (chat) {
        chat.title = newTitle;
      }
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(chat => chat.id === chatId);
      if (chat) {
        chat.messages.push(message);
        // If this is the first message, set it as the title
        if (chat.messages.length === 1) {
          chat.title = message.content;
        }
      }
    },
    setCurrentChat: (state, action) => {
      state.currentChatId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const {
  addChat,
  deleteChat,
  editChatTitle,
  addMessage,
  setCurrentChat,
  setSearchQuery,
  toggleSettings,
  setActiveModal,
  closeModal,
} = chatSlice.actions;

export const selectChats = (state) => state.chat.chats;
export const selectCurrentChatId = (state) => state.chat.currentChatId;
export const selectSearchQuery = (state) => state.chat.searchQuery;
export const selectIsSettingsOpen = (state) => state.chat.isSettingsOpen;
export const selectActiveModal = (state) => state.chat.activeModal;

export default chatSlice.reducer;