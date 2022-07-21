import React, { useState } from 'react';
import Container from "../Container";
import FormInput from '../form/FormInput';
import Title from "../form/Title";
import Submit from "../form/Submit";
import CustomLink from '../CustomLink';
import {
    useAuth,
    useNotification
    //useTheme
} from '../../hooks';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../../utils/helper';

const validateUserInfo = ({ email, password }) => {

    if (!email.trim()) return { ok: false, error: "Email is missing" }; 
    if (!isValidEmail(email)) return { ok: false, error: "Invalid email" };
    
    if (!password.trim()) return { ok: false, error: "Password is missing!" };
    if (password.length < 8) return { ok: false, error: "Password is to short, please have at least 8 characters" };

    return{ok:true}
}

export default function Signin() {
    //setting up state called userInfo where we will have this email and password
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate()

    const { updateNotification } = useNotification()
    const { handleLogin, authInfo } = useAuth()
    const { isPending, isLoggedIn } = authInfo

    //console.log(authInfo);

    //whenever the user makes changes to email and password, need to update them
    const handleChange = ({ target }) => {
        const { value, name } = target
        setUserInfo({...userInfo, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ok, error } = validateUserInfo(userInfo);
        
        //if there was something wrong with the submit, let the user know
        if (!ok) return updateNotification("error", error);
        //backend api, sending the email and password
        //sending to AuthProvider
        handleLogin(userInfo.email, userInfo.password)
    }

    useEffect(() => {
        //we want to move our user somewhere else
        //so need useNavigate hook
        if(isLoggedIn) navigate('/')
    }, [isLoggedIn])

    //const theme = useContext(ThemeContext);
    //console.log(theme);
    //theme.method();
    //const theme = useTheme();

    //bg-primary -> dark:bg-primary
    //only use bg-primary if we are in 'dark' mode
    return (
        <FormContainer>
            <Container>
                <form onSubmit={handleSubmit}  className={commonModalClasses +" w-72"}>
                    <Title>Sign in</Title>
                    <FormInput
                        value={userInfo.email}
                        onChange={handleChange}
                        label='Email'
                        placeholder='boba@gmail.com'
                        name='email' />
                    <FormInput
                        value={userInfo.password}
                        onChange={handleChange}
                        label='Password'
                        placeholder='********'
                        name='password'
                        type="password"
                    />
                    <Submit value="Sign in" busy={ isPending} />
                    
                    <div className="flex justify-between">
                        <CustomLink to="/auth/forget-password">Forget password</CustomLink>
                        <CustomLink to="/auth/Signup">Sign up</CustomLink>
                    </div>
                </form>
            </Container>
        </FormContainer>
    )
}