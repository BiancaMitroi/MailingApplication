
function checkMailAddress(email, callback) {
    const apiKey = process.env.REACT_APP_EMAIL_CHECK_API_KEY;
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4){
             if (xmlHttp.status === 200) {
                callback(xmlHttp.responseText);
            } else {
                // Pass error status and message to callback
                callback(JSON.stringify({
                    error: true,
                    status: xmlHttp.status,
                    statusText: xmlHttp.statusText || 'Request failed'
                }));
            }
            // const response = JSON.parse(xmlHttp.responseText);
            // // Checks if the email is deliverable which means it is valid and can receive emails
            // const isValid = response.deliverability === 'DELIVERABLE' && 
            //     // Checks if the email has a quality score above 0.8
            //     response.quality_score > 0.8 &&
            //     // Checks if the email format is valid
            //     response.is_valid_format.value === true
            //     // Checks if the email is not a free email provider which means it is from providers like Gmail, Yahoo, etc.
            //     && response.is_free_email.value === true
            //     // Checks if the email is not a disposable email which means it is not from temporary email providers
            //     && response.is_disposable_email.value === false
            //     // Checks if the email is not a catch-all email which means it is not a generic email that accepts all emails sent to it
            //     && response.is_catch_all_email.value === false
            //     // Checks if the email is not a role-based email which means it is not an email like info@, support@, etc.
            //     && response.is_role_based.value === false
            //     // Checks if the email is not a typo-squatted email which means it is not a misspelled version of a common domain
            //     && response.is_smtp_valid.value === true;
            // callback(isValid);
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}
export default checkMailAddress;