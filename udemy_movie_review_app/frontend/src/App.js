import React from "react";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Navbar from "./components/user/Navbar";
import Home from "./components/Home";
import EmailVerification from "./components/auth/EmailVerification";
import ForgetPassword from "./components/auth/ForgetPassword";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import NotFound from "./components/NotFound";

import {
  //BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useAuth } from "./hooks";
import AdminNavigator from "./navigator/AdminNavigator";
import SingleMovie from "./components/user/SingleMovie";
import MovieReviews from "./components/user/MovieReviews";

export default function App() {
  const { authInfo } = useAuth();
  //console.log(authInfo);
  //get the role from the res.json we sent back in the backend
  const isAdmin = authInfo.profile?.role === "admin";
  //console.log(isAdmin);

  if (isAdmin) {
    return <AdminNavigator />;
  }

  return (
    //when rendering multiple things, wrap inside fragments
    //empty fragments = <>

    //if the app finds any of the top routes, it will render the components
    //if use any invalid routes: go to NotFound

    //the path "/" is the what the normal users see (The Home component)
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verification" element={<EmailVerification />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="/movie/:movieId" element={<SingleMovie />} />
        <Route path="/movie/reviews/:movieId" element={<MovieReviews />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
