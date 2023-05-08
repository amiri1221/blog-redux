import { useSelector } from "react-redux";
import { SelectAllUsers } from "../reducers/UsersSlice";
import { Link } from "react-router-dom";
const PostAuthor = ({userId }) => {
    const users = useSelector(SelectAllUsers)

    const Author = users.find(user => user.id === userId);
    return (
        <span>
            {Author ? <Link to={`/user/${userId}`}>{Author.name}</Link> : "Unknow author"}
        </span>
    );
}

export default PostAuthor;