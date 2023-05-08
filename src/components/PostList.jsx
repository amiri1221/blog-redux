import { useSelector } from "react-redux";
import { selectPostIds} from "../reducers/PostSlice";
import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from "../reducers/PostSlice";
const Postlist = () => {

    const { isLoading, isSuccess, isError , error } = useGetPostsQuery()


    const posts = useSelector(selectPostIds);

    let content;
    if (isLoading) {
        content = <p>is loading ...</p>
    } else if (isSuccess) {
        content = posts.map(postId => <PostsExcerpt key={postId.id} postId={postId} />)
    } else if (isError) {
        content = <p>{error}</p>
    }
    return (
        <section>
            {content}
        </section>
    );
}

export default Postlist;