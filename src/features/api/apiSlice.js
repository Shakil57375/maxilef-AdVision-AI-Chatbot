import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
    baseUrl: "http://72.167.224.36:5006/",
    // http://72.167.224.36:5006/
    prepareHeaders: (headers, { getState }) => {
        // Try to get token from Redux state
        const token = getState().auth?.accessToken || null;
        // If token not in state, retrieve from local storage
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        } else {
            const authData = JSON.parse(localStorage.getItem("auth")); // Parse the `auth` object from local storage
            if (authData?.access) {
                headers.set("authorization", `Bearer ${authData.access}`); // Set Authorization header
            }
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery,
    tagTypes: ["user", "Chats"],
    endpoints: () => ({}),
});
