import React, {useState} from 'react';
import Container from "../Container";
import FormInput from '../form/FormInput';
import Title from "../form/Title";
import Submit from "../form/Submit";
import { Link } from 'react-router-dom';
import CustomLink from '../CustomLink';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { createUser } from '../../api/auth';


const validateUserInfo = ({ name, email, password }) => {
    const isValidName = /^[a-z A-Z]+$/;
    if(!name.trim()) return { ok: false, error: "Name is missing!" };
    if(!isValidName.test(name)) return { ok: false, error: 'Invalid Name' };

    const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.trim()) return { ok: false, error: "Email is missing" }; 
    if (!isValidEmail.test(email)) return { ok: false, error: "Invalid email" };
    
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
    
    //handleChange will handle all the changes for the components
    const handleChange = ({ target }) => {
        //destructure
        const { value, name } = target
        setUserInfo({...userInfo, [name]: value})
        //console.log(target.value, target.name);
    }

    const handleSubmit = async (e) => {
        //stop the form refreshing and losing info
        e.preventDefault();
        //console.log(userInfo);
        
        //what if the user does not submit 1 field, need to validate
        const { ok, error } = validateUserInfo(userInfo);
        
        if (!ok) return console.log(error)
        
        //console.log(userInfo)
        //now send the data to the backend to create the user
        //use axios
        const { error2, user } = await createUser(userInfo);
        if (error2) return console.log(error2);
        console.log(user);
    }

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