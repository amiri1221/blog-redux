import AddPostForm from './components/AddPostForm'
import Postlist from './components/PostList'
import Layout from './Layout/Layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import SinglePostPage from './components/SinglePost';
import EditePostForm from './components/EditePostForm';
import UserList from './components/UserList';
import UserPage from './components/UserPage';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Postlist />} />

          <Route path="post">
            <Route index element={<AddPostForm />} />
            <Route path=":postId" element={<SinglePostPage />} />
            <Route path="edit/:postId" element={<EditePostForm />} />
          </Route>

          <Route path="user">
            <Route index element={<UserList />} />
            <Route path=":userId" element={<UserPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
