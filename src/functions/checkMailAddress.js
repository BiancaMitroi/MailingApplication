
/**
 * Check if an email address is valid.
 * @param {string} email - The email address to check.
 * @param {function} callback - The callback function to call with the result.
 * @returns {void} - No return value, the function calls an external API and passes the result to the callback.
 */
async function checkMailAddress(email) {
    const checkEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!checkEmailRegex.test(email)) {
        return { status: "Invalid", mailAddress: email };
    }
    const apiKey = process.env.REACT_APP_EMAIL_CHECK_API_KEY;
    const url = `https://client.myemailverifier.com/verifier/validate_single/${email}/${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function checkMailAddresses(emails) {
    const results = [];
    for (let email of emails) {
        const result = checkMailAddress(email);
        results.push(result);
    }
    return results;
}

export { checkMailAddress, checkMailAddresses };