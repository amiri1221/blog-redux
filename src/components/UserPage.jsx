import { Link, useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import { selectUserById } from "../reducers/UsersSlice";
import { useGetPostsByUserIdQuery } from '../reducers/PostSlice';
const UserPage = () => {
    const { userId } = useParams;

    const [] = useGetPostsByUserIdQuery()

    const user = useSelector(state => selectUserById(state, Number(userId)))
    console.log(user)

    const {
        data: postForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId)

    console.log(postForUser)

    // const postForUser = useSelector(state => {
    //     const allpost = SelectAllposts(state)
    //     return allpost.filter(post => post.userId === Number(userId))    
    // })

    let content;
    if (isLoading) {
        content = <p>is Loding</p>
    } else if (isSuccess) {
        const { ids, entities } = postForUser;
        content = ids.map(id => (
            <li key={id}>
                <Link to={`/post/${id}`} >{entities[id].title}</Link>
            </li>
        ))
    } else if (isError) {
        content = <p>{error}</p>
    }

    return (
        <section>
            <h2>{user?.name}</h2>

            <ol>{content}</ol>
        </section>
    );
}

export default UserPage;