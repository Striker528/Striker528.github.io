import React from 'react';
import Container from "../Container";
import FormInput from '../form/FormInput';
import Title from "../form/Title";
import Submit from "../form/Submit";
import CustomLink from '../CustomLink';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';

export default function ConfirmPassword() {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + " w-96"}>
          <Title>Enter New Password</Title>
          <FormInput label='New Password' placeholder='********' name='password' type = 'password'/>
          <FormInput label='Confirm Password' placeholder='********' name='confirmPassword' type = 'password'/>
          <Submit value="Submit New Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
