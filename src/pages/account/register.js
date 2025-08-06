import '../form.css';
import validateEmailAddress from '../../functions/validateEmailAddress';
import validatePassword from '../../functions/validatePassword';
import { useEffect, useState } from 'react';

function Register() {

    const [passwordMessage, setPasswordMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState([]);

  const handleValidateEmail = (e) => {
    const email = e.target.value;
    if (validateEmailAddress(email)) {
      setEmailMessage('');
    } else {
      setEmailMessage('Invalid email address');
    }
  }

const handleValidatePassword = (e) => {
    const password = e.target.value;
    const validationResult = validatePassword(password);
    if (validatePassword(password) == true) {
      setPasswordMessage('');
    } else {
      setPasswordMessage(validationResult);
    }
  }

  return (
    <div className="register">
      <h1>Register Page</h1>
      <form>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        {emailMessage && <div className="error">{emailMessage}</div>}
        <input type="email" placeholder="Email" onChange={(e) => handleValidateEmail(e)} />
        {passwordMessage && <div className="error">{passwordMessage}</div>}
        <input type="password" placeholder="Password" onChange={(e) => handleValidatePassword(e)} />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
export default Register;