import React, { useState } from 'react';
import Container from "../Container";
import FormInput from '../form/FormInput';
import Title from "../form/Title";
import Submit from "../form/Submit";
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import { commonModalClasses } from '../../utils/theme';
import { forgetPassword } from '../../api/auth';
import { isValidEmail } from '../../utils/helper';
import { useNotification } from '../../hooks';

export default function ForgetPassword() {

  const [email, setEmail] = useState("");

  const {updateNotification} = useNotification()

  const handleChange = ({ target }) => {
    const { value } = target
    setEmail(value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isValidEmail(email)) return updateNotification('error', 'Invalid email!')
    
    //only need to send the email to the backend forgetPassword
    //from the backend, only get the message ("Link sent to your email!") if everything goes good
    const { error, message } = await forgetPassword(email)
    
    if (error) return updateNotification('error', error)
    
    updateNotification('success', message)
  }


  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            onChange={handleChange}
            value={email}
            label='Email'
            placeholder='boba@gmail.com'
            name='email' />
          <Submit value="Send Link" />
                
          <div className="flex justify-between">
            <CustomLink to="/auth/Signin">Sign in</CustomLink>
            <CustomLink to="/auth/Signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
