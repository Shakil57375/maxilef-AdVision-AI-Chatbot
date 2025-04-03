import { apiSlice } from "../api/apiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => "/chat_app/get_all_chat_list_of_user/",
      providesTags: [{ type: "Chats", id: "LIST" }],
    }),
    getChatContents: builder.query({
      query: (chatId) => `/chat_app/get_chat_contents/${chatId}/`,
      providesTags: (result, error, arg) => [{ type: "Chats", id: arg }],
    }),

    createChat: builder.mutation({
      query: (message) => ({
        url: "/chat_app/create_chat/",
        method: "POST",
        body: { text_content: message },
      }),
      invalidatesTags: [{ type: "Chats", id: "LIST" }],
    }),

    addMessageToChat: builder.mutation({
      query: ({ chatId, message }) => ({
        url: `/chat_app/add_message_to_chat/${chatId}/`,
        method: "POST",
        body: { text_content: message },
      }),
      invalidatesTags: (result, error, { chatId }) => [{ type: "Chats", id: chatId }],
    }),
    pinChat: builder.mutation({
      query: ({ chatId, pinDate }) => ({
        url: `/chat_app/pin_a_chat/${chatId}/`,
        method: "POST",
        body: { pin_date: pinDate },
      }),
      invalidatesTags: ["Chats"], // Refetch edited chats
    }),
    unpinChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat_app/unpin_a_chat/${chatId}/`,
        method: "POST",
      }),
      invalidatesTags: ["Chats"],
    }),
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat_app/delete_a_chat/${chatId}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Chats", id: "EditedChats" }, { type: "Chats", id: "LIST" }], // Invalidate both EditedChats and Sidebar list
    }),

    saveChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat_app/save_a_chat/${chatId}/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Chats", id: "LIST" },
        { type: "Chats", id: arg },
      ],
    }),
    renameChat: builder.mutation({
      query: ({ chatId, newTitle }) => ({
        url: `/chat_app/update_chat_title/${chatId}/`,
        method: "POST",
        body: { chat_title: newTitle }, // Pass the new chat title
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Chats", id: "LIST" }, // Refresh chat list
        { type: "Chats", id: chatId }, // Refresh the specific chat
      ],
    }),

    getAllEditedChats: builder.query({
      query: () => `/chat_app/get_all_edited_chat/`,
      providesTags: ["EditedChats"],
    }),
    postEditedChat: builder.mutation({
      query: ({ chatId, content }) => ({
        url: `/chat_app/edit_conversation/${chatId}/`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["EditedChats"],
    }),
    pinEditedChat: builder.mutation({
      query: ({ chatId, pinDate }) => ({
        url: `/chat_app/pin_edited_chat/${chatId}/`, // `chatId` goes here
        method: "POST",
        body: { pin_date: pinDate }, // `pinDate` goes here
      }),      
      invalidatesTags: ["EditedChats"], // Trigger refresh
    }),
    unpinEditedChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat_app/unpin_edited_chat/${chatId}/`,
        method: "POST",
      }),
      invalidatesTags: ["EditedChats"], // Trigger refresh
    }),
    deleteEditedChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat_app/delete_edited_chat/${chatId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["EditedChats"], // Trigger refresh
    }),
    getSingleEditedChat: builder.query({
      query: (chatId) => `/chat_app/get_a_edited_chat/${chatId}/`,
      providesTags: (result, error, arg) => [{ type: "EditedChats", id: arg }],
    }),
    updateEditedChat: builder.mutation({
      query: ({ chatId, content }) => ({
        url: `/chat_app/update_edited_conversation/${chatId}/`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["EditedChats"],
    }),
    
  }),
  overrideExisting: true,
});


export const {
  useGetChatsQuery,
  useGetChatContentsQuery,
  useCreateChatMutation,
  useAddMessageToChatMutation,
  usePinChatMutation,
  useUnpinChatMutation,
  useDeleteChatMutation,
  useSaveChatMutation,
  useRenameChatMutation,
  usePostEditedChatMutation,
  useGetAllEditedChatsQuery,
  usePinEditedChatMutation,
  useUnpinEditedChatMutation,
  useDeleteEditedChatMutation,
  useGetSingleEditedChatQuery,
  useUpdateEditedChatMutation,
} = chatApi;