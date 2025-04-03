import { apiSlice } from "../api/apiSlice";

export const classApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all classes
        getClasses: builder.query({
            query: () => "/chat_app/get_all_classes/", // Endpoint to fetch all folders
            providesTags: (result) =>
                result
                    ? // Map over fetched classes to enable cache invalidation for each
                    [...result.map(({ id }) => ({ type: "Classes", id })), { type: "Classes", id: "LIST" }]
                    : [{ type: "Classes", id: "LIST" }],
        }),

        // Create a new class
        createClass: builder.mutation({
            query: (className) => ({
                url: "/chat_app/create_class/",
                method: "POST",
                body: { folder_name: className }, // Payload for folder creation
            }),
            invalidatesTags: [{ type: "Classes", id: "LIST" }], // Invalidates folder list cache
        }),

        // Pin a chat to a folder
        pinChatToFolder: builder.mutation({
            query: ({ editId, folderId }) => ({
                url: `/chat_app/pin_an_edited_chat_to_a_folder/${editId}/${folderId}/`, // Pin endpoint
                method: "POST",
            }),
            invalidatesTags: [{ type: "Classes", id: "LIST" }], // Optionally refresh folders
        }),

        // Unpin a chat from a folder
        unpinChatFromFolder: builder.mutation({
            query: ({ editId, folderId }) => ({
                url: `/chat_app/unpin_an_edited_chat_to_a_folder/${editId}/${folderId}/`, // Unpin endpoint
                method: "POST",
            }),
            invalidatesTags: [{ type: "Classes", id: "LIST" }], // Optionally refresh folders
        }),
        // Rename a chat title
        renameChatTitle: builder.mutation({
            query: ({ chatId, newTitle }) => ({
                url: `/chat_app/rename_edited_chat/${chatId}/`,
                method: "PATCH",
                body: { chat_name: newTitle }, // Payload for renaming
            }),
            providesTags: ["EditedChats"], // Optionally refresh chat details
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetClassesQuery,
    useCreateClassMutation,
    usePinChatToFolderMutation,
    useUnpinChatFromFolderMutation,
    useRenameChatTitleMutation,
} = classApi;
