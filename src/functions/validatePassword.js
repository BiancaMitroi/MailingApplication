
/**
 * Validate the password strength.
 * @param {string} password - The password to validate.
 * @returns {boolean|string[]} - True if the password is valid, or an array of error messages.
 */
function validatePassword(password) {
    const errorMessages = [];
  // Check if the password is at least 8 characters long
  if (password.length < 8) {
    errorMessages.push("Password must be at least 8 characters long.");
  }

  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errorMessages.push("Password must contain at least one uppercase letter.");
}

  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errorMessages.push("Password must contain at least one lowercase letter.");
  }

  // Check if the password contains at least one digit
  if (!/\d/.test(password)) {
    errorMessages.push("Password must contain at least one digit.");
  }

  // Check if the password contains at least one special character
  const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharacters.test(password)) {
    errorMessages.push("Password must contain at least one special character.");
  }

  // If all checks pass, return true
  return errorMessages.length === 0 ? true : errorMessages;
}

export default validatePassword;