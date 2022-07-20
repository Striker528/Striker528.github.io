import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from "../Container";
import FormInput from '../form/FormInput';
import Title from "../form/Title";
import Submit from "../form/Submit";
import { useEffect, useState } from 'react';
import FormContainer from '../form/FormContainer';
import { commonModalClasses } from '../../utils/theme';
import { verifyUserEmail } from '../../api/auth';

const OTP_LENGTH = 6;

const isValidOTP = (otp) => {
  //['', '', '', '', '', '']
  //need to make sure we have all 6 OTP's and are all integers

  let valid = false;

  for (let val of otp) {
    //1st: converting string to int
    //2nd: checking if it is a number
    valid = !isNaN(parseInt(val))
    if (!valid) break;
  }

  return valid;
};

/*
First of all the problem is inside React 18 when we try to use both onChange and onKeyDown 
both methods will fire one by one and that also with different indexs. 
And because of that you will see it will clear some unwanted input field and ignores the other.

The solution is we have to stop from running both methods with different indexs.

We just have to create currentOTPIndex and reasign it's value inside handleKeyDown (because it runs before) 
and now we have to use the currentOTPIndex instead of the index. 
And now because we are using currentOTPIndex 
  we don't need to pass the index inside handleOtpChange so we can directly use onChange={handleOtpChange}  
Now you should see the result that you want. 
*/
let currentOTPIndex;



export default function EmailVerification() {
  //new states otp and setOtp
  //have 6 input fields now, (maybe change later)
  //so need arrays of size OTP_length with '' in each index
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));

  //another state
  //reference
  const [activeOtpIndex, setActiveOtpIndex] = useState(0)

  //creating input
  //use useRef to create a reference
  //then pass this reference to the ref hook in the otp.map(()) below
  const inputRef = useRef();

  //when want to verify email, use the user, which is inside the state
  const { state } = useLocation();
  console.log("State1 is:")
  console.log(state);
  //user will have user._id
  //need to save the user_id and OTP
  //initially, state will have nothing in it, so need to give the optional parameter of ?
  //which means, if there is a state, take the user component
  //if no state, continue on
  const user = state?.user;
  console.log("State2 is:")
  console.log(state)
  console.log("User is:")
  console.log(user)

  //for manual navigation
  const navigate = useNavigate();

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  }
  const focusPrevInputField = (index) => {
    //don't go below 0
    //so if the user hits backspace at index 0, they will stay there
    let nextIndex;
    const diff = index - 1;
    //if diff is not equal to 0, then: can use the diff of going back 1, else: stay at 0
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  }

  //const handleOtpChange = ({ target }, index) => {
  //have to remove the index from parameter in React 18
  const handleOtpChange = ({ target }) => {
    //this value is what the user inputs, the number they input
    const { value } = target;

    //this doesn't work, cannot go to next field and not show up
    //const newOtp = otp.push(value);
    //need to spread the old otp 
    const newOtp = [...otp]
    //only want 1 value in each index, so use .substring() method
    //only want last value so: substring(leng-1, len)
    //or: substring(value.length - 1, value.length)
    //newOtp[index] = value.substring(value.length - 1, value.length);
    //have to change which index, see /**/ above
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);


    //handle next input field
    //type inside 1 input field, move to the next input field
    //setActiveOtpIndex(index + 1);
    //want to handle the user hitting backspace and going to the previous box, which this does not do
    //so create a function focusNextInputField which will help us
    //if put in 
    //console.log(value)
    //and then backspace, see that we get no value
    //so if we get no value, go into a function that will change the index to one prior
    //if (!value) focusPrevInputField(index);
    //have to change which index, see React18 fix above in /* */
    if (!value) focusPrevInputField(currentOTPIndex);
    //else focusNextInputField(index);
    //have to change which index, see React18 fix above
    else focusNextInputField(currentOTPIndex);


    //once the user inputs the number, need to change location on the otp array
    //this setOtp does not work
    //once you start typing, it will put all the input into 1 box and get rid of the other boxes
    //setOtp([value]);
    setOtp([...newOtp]);
  };

  const handleKeyDown = ({ key }, index) => {
    //console.log(key)
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPrevInputField(currentOTPIndex);
    }
  };

  //to send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValidOTP(otp)) {
      return console.log('invalid OTP');
    }

    //submit otp
    //need to validate otp form, only then can we submit otp
    //console.log(otp);
    //if look at backend/controller/user.js and look at the verifyEmail function
    //see that we get back the message at the very bottom
    const { error, message }= await verifyUserEmail({ userId: user.id, OTP: otp });
  
    if (error) return console.log(error)
    
    console.log(message);
  }

  //hook
  useEffect(() => {
    //pass the code for the focus part
    //need a reference, already have activeOtpIndex
    //have currently active input field
    //Remember, when first start up, will have nothing in the input
    //so current has the ? to make this optional
    //so only focus if there is something in this field
    inputRef.current?.focus()

    //array for dependency
    //only do this when the activeOtpIndex changes, so that it why it is below
  }, [activeOtpIndex])

  //if no user has been found, deal with it
  //v1:
  //if (!user) return null;
  //v2
  //Forcing that whomever is accessing the auth/verification must be a user
  ///*
  useEffect(() => {
    if (!user) {
      console.log("No user when checking user")
      navigate('/not-found')
    }
    //do this if the user is changed
  }, [user]);
  //*/


  //have an otp array and need to access the elements: otp.map
  //initaly empty array, have nothing == _
  //need index to access the elements

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className = "text-center dark:text-dark-subtle text-light-subtle">OTP has been sent to your email</p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            
            {otp.map((_, index) => {
              return (
                <input
                  //creating the reference
                  //if it is active, then the reference is inputRef, otherwise it is null
                  //when used like this, we can reference the top <input label
                  //do whatever we want with this input
                  //Main idea: create reference to this input if activeOtpIndex === index
                  //cannot have same reference to multiple objects, so that is why we have this cheek
                  //this will give us the currently active input field
                  //with the inputRef, can access the <input directly above
                  ref = {activeOtpIndex === index ? inputRef : null}
                  //going from 1 box to the next in the OTP
                  //have to set the key = {something}
                  key = {index}
                  type="number"
                  //if there is something, use the opt[index], if not, use ""
                  value={otp[index] || ""}
                  //whenever use this value, need onChange
                  //need access on this given index and the event object given my onChange
                  //on an event, call handleOtpChange with the event and index #
                  //onChange={(e) => handleOtpChange(e, index)}
                  //React 18
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2  
                  dark:border-dark-subtle
                  border-light-subtle
                  dark:focus:border-white
                  focus:border-primary
                  rounded
                  bg-transparent
                  outline-none
                  text-center
                  dark:text-white
                  text-primary
                  font-semibold
                  text-xl
                  spin-button-none"
                />
              );
            })}
          </div>
          
          <Submit value="Submit Code" />
        </form>
      </Container>
    </FormContainer>
  );
}
