import React from 'react';
import Container from "../Container";
import FormInput from '../form/FormInput';
import Title from "../form/Title";
import Submit from "../form/Submit";
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import { commonModalClasses } from '../../utils/theme';

export default function ForgetPassword() {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + " w-96"}>
          <Title>Please Enter Your Email</Title>
          <FormInput label='Email' placeholder='boba@gmail.com' name='email' />
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
