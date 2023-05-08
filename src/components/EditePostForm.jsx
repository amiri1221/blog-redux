import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SelectAllUsers } from "../reducers/UsersSlice";
import { SelectPostById } from "../reducers/PostSlice";
import { useUpdatePostMutation, useDeletePostMutation } from "../reducers/PostSlice";

const EditePostForm = () => {
    const { postId } = useParams();
    const navigate = useNavigate()

    const [updatePost, { isLoading }] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()


    const post = useSelector((state) => SelectPostById(state, Number(postId)))
    const users = useSelector(SelectAllUsers)


    const [title, setTitle] = useState(post?.title)
    const [content, setContent] = useState(post?.body)
    const [userId, setUserId] = useState(post?.userId)


    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(Number(e.target.value))


    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await updatePost({ id: post.id, title, body: content, userId }).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${postId}`)

            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    const onDeletePostClicked = async () => {
        try {
            await deletePost({ id: post.id }).unwrap()

            setTitle('')
            setContent('')
            setUserId('')
            navigate("/")

        } catch (err) {
            console.error('Failed to save the post', err)
        }
    }

    const usersOptions = users.map(user => (
        <option
            key={user.id}
            value={user.id}
        >{user.name}</option>
    ))

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
                <button className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    );
}

export default EditePostForm;