import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./utils/AuthRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";

import SinglePost from "./pages/SinglePost";

function App() {
  return (
    <AuthProvider>
      <div className="ui container">
        <Router>
          <MenuBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthRoute redirectTo="/" />}>
              <Route path="" element={<Login />} />
            </Route>
            <Route path="/register" element={<AuthRoute redirectTo="/" />}>
              <Route path="" element={<Register />} />
            </Route>
            <Route path="/posts/:postId" element={<SinglePost />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
