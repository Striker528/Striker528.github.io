import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from "../Container";
import FormInput from '../form/FormInput';
import Title from "../form/Title";
import Submit from "../form/Submit";
//import { Link } from 'react-router-dom';
import CustomLink from '../CustomLink';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { createUser } from '../../api/auth';
import { useAuth, useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';


const validateUserInfo = ({ name, email, password }) => {
    const isValidName = /^[a-z A-Z]+$/;
    if(!name.trim()) return { ok: false, error: "Name is missing!" };
    if(!isValidName.test(name)) return { ok: false, error: 'Invalid Name' };

    if (!email.trim()) return { ok: false, error: "Email is missing" }; 
    if (!isValidEmail(email)) return { ok: false, error: "Invalid email" };
    
    if (!password.trim()) return { ok: false, error: "Password is missing!" };
    if (password.length < 8) return { ok: false, error: "Password is to short, please have at least 8 characters" };

    //everything is good, return ok:true
    return{ok:true}
}

export default function Signup() {

    //talking to backend
    //setting default values
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    //destructure from inside userInfo
    const { name, email, password } = userInfo
    //console.log("Desconstrucing from inside userInfo, Email is:")
    //console.log(email)

    //navigating around manually
    const navigate = useNavigate()

    const { updateNotification } = useNotification()
    const { authInfo } = useAuth()
    const { isLoggedIn } = authInfo
    
    //handleChange will handle all the changes for the components
    const handleChange = ({ target }) => {
        //destructure
        const { value, name } = target
        setUserInfo({ ...userInfo, [name]: value })
        //console.log("In handleChange for Signup:")
        //console.log(target.value, target.name);
    }

    const handleSubmit = async (e) => {
        //stop the form refreshing and losing info
        e.preventDefault();
        //console.log(userInfo);
        
        //what if the user does not submit 1 field, need to validate
        const { ok, error } = validateUserInfo(userInfo);
        
        //if (!ok) return console.log(error)
        if (!ok) return updateNotification("error", error);
        
        //console.log(userInfo)
        //now send the data to the backend to create the user
        //use axios
        const { error2, user } = await createUser(userInfo);
        if (error2) return console.log(error2);

        //No error creating the user:
        //when going to the verification, need to access the user
        //pass configuration object, where pass state, in state, pass the user
        navigate('/auth/verification', {
            //change from {user: Response.user} to {user} to fix the issue of not being able to go from sign up to enter OTP
            state: { user },
            //replace the previous history
            //once they create an account by submitting the OTP
            //cannot go back to the signup page
            replace: true
        });
        //console.log(user);
    }

    useEffect(() => {
        //we want to move our user somewhere else
        //so need useNavigate hook
        if(isLoggedIn) navigate('/')
    }, [isLoggedIn])

    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
                    <Title>Sign up</Title>
                    <FormInput
                        value={name}
                        onChange = {handleChange}
                        label='Name'
                        placeholder='Boba Fett'
                        name='name' />
                    <FormInput
                        value={email}
                        onChange = {handleChange}
                        label='Email'
                        placeholder='boba@gmail.com'
                        name='email' />
                    <FormInput
                        value={password}
                        onChange = {handleChange}
                        label='Password'
                        placeholder='********'
                        name='password'
                        type="password" />
                    <Submit value="Sign up" />
                    
                    <div className="flex justify-between">
                        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
                        <CustomLink to = "/auth/Signin">Sign in</CustomLink>
                    </div>
                </form>
            </Container>
        </FormContainer>
    )
}