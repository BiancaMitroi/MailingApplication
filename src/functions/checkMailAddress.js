
/**
 * Check if an email address is valid.
 * @param {string} email - The email address to check.
 * @param {function} callback - The callback function to call with the result.
 * @returns {void} - No return value, the function calls an external API and passes the result to the callback.
 */
function checkMailAddress(email, callback) {
    const apiKey = process.env.REACT_APP_EMAIL_CHECK_API_KEY;
    const url = `https://api-eu.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4){
             if (xmlHttp.status === 200) {
                callback(xmlHttp.responseText);
            } else {
                callback(JSON.stringify({
                    error: true,
                    status: xmlHttp.status,
                    statusText: xmlHttp.statusText || 'Request failed'
                }));
            }
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}
export default checkMailAddress;