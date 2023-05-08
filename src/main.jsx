import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from './store'
import { Provider } from 'react-redux'
import { fetchUsers } from './reducers/UsersSlice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { extendedApiSlice } from './reducers/PostSlice'

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate())
store.dispatch(fetchUsers())


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>

  </React.StrictMode>,
)
