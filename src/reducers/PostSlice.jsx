import { createSlice, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";
import id from "date-fns/locale/id";
//const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';


const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    // status: "idel", // idel , loding , succeeded , failed
    // error: null,
    // count: 0
})

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                { type: 'Post', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        getPostsByUserId: builder.query({
            query: id => `/posts/?userId=${id}`,
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                { type: 'Post', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),

            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `posts/${postId}`,
                method: 'PATCH',
                // In a real app, we'd probably need to base this on user ID somehow
                // so that a user can't do the same reaction more than once
                body: { reactions }
            }),
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const post = draft.entities[postId]
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
    })
})

// export const fetchPosts = createAsyncThunk('post/fetcher', async () => {
//     try {
//         const response = await axios.get(POSTS_URL)
//         return [...response.data]
//     } catch (err) {
//         console.log(err.message)
//     }
// })
// export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
//     const { id } = initialPost;
//     try {
//         const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
//         return response.data
//     } catch (err) {
//         return err.message;
//         // return initialPost; // only for testing Redux!
//     }
// })

// export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
//     const { id } = initialPost;
//     try {
//         const response = await axios.delete(`${POSTS_URL}/${id}`)
//         if (response?.status === 200) return initialPost;
//         return `${response?.status}: ${response?.statusText}`;
//     } catch (err) {
//         return err.message;
//     }
// })


// export const addNewPost = createAsyncThunk("addNewsPosr/post", async (initialPost) => {
//     try {
//         const response = await axios.post(POSTS_URL, initialPost)
//         return response.data
//     } catch (err) {
//         console.log(err.message)
//     }
// })
// const PostSlice = createSlice({
//     name: "post",
//     initialState,
//     reducers: {
//         // postAdds: {
//         //     reducer(state, action) {
//         //         state.posts.push(action.payload)
//         //     },
//         //     prepare(title, content, userId) {
//         //         return {
//         //             payload: {
//         //                 id: nanoid(),
//         //                 title,
//         //                 content,
//         //                 date: new Date().toISOString(),
//         //                 userId,
//         //                 reactions: {
//         //                     thumbsUp: 0,
//         //                     wow: 0,
//         //                     heart: 0,
//         //                     rocket: 0,
//         //                     coffee: 0
//         //                 }
//         //             }
//         //         }
//         //     },

//         // },
//         reactionAdded(state, action) {
//             const { postId, reaction } = action.payload
//             const existingPost = state.entities[postId]
//             if (existingPost) {
//                 existingPost.reactions[reaction]++
//             }
//         },
//         increaseCount(state ,action){
//                state.count = state.count + 1
//         }
//     },
//     extraReducers(builder) {
//         builder
//             .addCase(fetchPosts.pending, (state, action) => {
//                 state.status = "loading"
//             })
//             .addCase(fetchPosts.fulfilled, (state, action) => {
//                 state.status = 'succeeded'
//                 // Adding date and reactions
//                 let min = 1;
//                 const loadedPosts = action.payload.map(post => {
//                     post.date = sub(new Date(), { minutes: min++ }).toISOString();
//                     post.reactions = {
//                         thumbsUp: 0,
//                         wow: 0,
//                         heart: 0,
//                         rocket: 0,
//                         coffee: 0
//                     }
//                     return post;
//                 });

//                 // Add any fetched posts to the array
//                 postAdapter.upsertMany(state , loadedPosts)
//             })
//             .addCase(fetchPosts.rejected, (state, action) => {
//                 state.status = "failed"
//                 state.error = action.error.message

//             })
//             .addCase(addNewPost.fulfilled, (state, action) => {
//                 action.payload.userId = Number(action.payload.userId)
//                 action.payload.data = new Date().toDateString
//                 action.payload.reactions = {
//                     thumbsUp: 0,
//                     wow: 0,
//                     heart: 0,
//                     rocket: 0,
//                     coffee: 0
//                 }
//                 console.log(action.payload)
//                 postAdapter.addOne(state , action.payload)
//             })
//             .addCase(updatePost.fulfilled, (state, action) => {
//                 if (!action.payload?.id) {
//                     console.log('Update could not complete')
//                     console.log(action.payload)
//                     return;
//                 }
//                 const { id } = action.payload
//                 action.payload.date = new Date().toISOString();
//                // const post = state.posts.filter(post => post.id !== id)
//                 postAdapter.upsertOne(state , action.payload)
//             })
//             .addCase(deletePost.fulfilled, (state, action) => {
//                 if (!action.payload?.id) {
//                     console.log('Delete could not complete')
//                     console.log(action.payload)
//                     return;
//                 }
//                 const { id } = action.payload
//                // const posts = state.posts.filter(post => post.id !== id)
//                 postAdapter.removeOne(state , id)

//             })

//     }
// })
export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice


// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

// Creates memoized selector
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: SelectAllposts,
    selectById: SelectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)

// export const getPostsStatus = (state) => state.posts.status;
// export const getPostsError = (state) => state.posts.error;
// export const getCounter = (state) => state.posts.count;

// export const selectPostByUser = createSelector(
//     [SelectAllposts, (state, userId) => userId],
//     (post, userId) => post.filter(post => post.userId === userId)
// )


// export const { reactionAdded, increaseCount } = PostSlice.actions
// export default PostSlice.reducer;
