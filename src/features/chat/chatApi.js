import { apiSlice } from "../api/apiSlice"

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all chats for the current user
    getAllChats: builder.query({
      query: () => "api/chatbot/all-chats",
      providesTags: ["Chats"],
    }),

    // Get a specific chat by ID
    getChatById: builder.query({
      query: (chatId) => `api/chatbot/history/${chatId}`,
      providesTags: (result, error, id) => [{ type: "Chat", id }],
    }),

    // Start a new chat or continue an existing one
    sendMessage: builder.mutation({
      query: ({ chatId, userMessage }) => ({
        url: "api/chatbot/message",
        method: "POST",
        body: {
          chatId: chatId || undefined,
          userMessage,
        },
      }),
      invalidatesTags: (result) => ["Chats", { type: "Chat", id: result?.chatHistory?.id }],
    }),

    // Update chat name
    renameChat: builder.mutation({
      query: ({ chatId, newTitle }) => ({
        url: `api/chatbot/update-chat-name/${chatId}`,
        method: "PUT",
        body: {
          newChatName: newTitle,
        },
      }),
      invalidatesTags: (result, error, { chatId }) => ["Chats", { type: "Chat", id: chatId }],
    }),

    // Delete a chat
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `api/chatbot/delete-chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chats"],
    }),

    // Save/pin a chat
    saveChat: builder.mutation({
      query: (chatId) => ({
        url: `api/chatbot/save-chat/${chatId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, chatId) => ["Chats", { type: "Chat", id: chatId }],
    }),

    // Upload files for chat
    uploadChatFiles: builder.mutation({
      query: (formData) => ({
        url: "api/chatbot/upload-files",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetAllChatsQuery,
  useGetChatByIdQuery,
  useSendMessageMutation,
  useRenameChatMutation,
  useDeleteChatMutation,
  useSaveChatMutation,
  useUploadChatFilesMutation,
} = chatApi
