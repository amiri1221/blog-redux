import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import ReactionButon from "./ReactionButton";
import TimeAge from "./TimeAgo";
import { useSelector } from "react-redux";
import { SelectPostById } from "../reducers/PostSlice";

const PostsExcerpt = ({ postId }) => {
    const post = useSelector(state => SelectPostById(state, postId))
    return (
        <article>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>ViewPost</Link>
                <PostAuthor userId={post.userId} />
                <TimeAge timestamp={post.date} />
            </p>
            <ReactionButon post={post} />
        </article>
    );
}

export default PostsExcerpt;