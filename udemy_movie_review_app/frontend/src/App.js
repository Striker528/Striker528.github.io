import React from 'react';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import Navbar from './components/user/Navbar';
import Home from './components/Home';
import EmailVerification from './components/auth/EmailVerification';
import ForgetPassword from './components/auth/ForgetPassword';
import ConfirmPassword from './components/auth/ConfirmPassword';
import NotFound from './components/NotFound';

import {
    //BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

export default function App() {
    return (
        //when rendering multiple things, wrap inside fragments
        //empty fragments = <>

        //if the app finds any of the top routes, it will render the components
        //if use any invalid routes: go to NotFound
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/auth/signin' element={<Signin />} />
                <Route path='/auth/signup' element={<Signup />} />
                <Route path='/auth/verification' element={<EmailVerification />} />
                <Route path='/auth/forget-password' element={<ForgetPassword />} />
                <Route path='/auth/confirm-password' element={<ConfirmPassword />} />

                <Route path='*' element={<NotFound />} />
                
            </Routes>
        </>
    );
}