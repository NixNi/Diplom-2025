import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import Example from "./components/Example";
import Viewer from "./pages/Viewer";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import { useAppSelector } from "./hooks/redux";
// import CreateGroup from "./pages/CreateGroup";
// import Group from "./pages/Group";
// import CreatePost from "./pages/CreatePost";
// import PostPage from "./pages/PostPage";
// import { updateUserAsync } from "./store/user/user.slice";
// import { useDispatch } from "react-redux";
// import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
// import { useEffect } from "react";

function App() {
  // const dispatch = useDispatch<ThunkDispatch<unknown, unknown, AnyAction>>();
  // useEffect(() => { dispatch(updateUserAsync()); },[dispatch]);
  // const User = useAppSelector((state) => state.user);
  // const prevLocation = useLocation();
  // const ProfileNav = User.id
  //   ? "/profile/" + User.login
  //   : `/login?redirectTo=${prevLocation.pathname}`;
  return (
    <div className="h-full w-full">
      <Navigation />
      <div className="pt-12">
        <Routes>
          <Route path="/" element={<Viewer/>} />
          <Route path="/example" element={<Example modelName="tree" />} />
          {/* <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Navigate to={ProfileNav} />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/create/group" element={<CreateGroup />} />
          <Route path="/group/:groupname" element={<Group />} />
          <Route path="/create/post" element={<CreatePost />} />
          <Route path="/post/:postid" element={<PostPage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
