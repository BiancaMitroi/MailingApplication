
function checkMailAddress(email, callback) {
    const apiKey = process.env.REACT_APP_EMAIL_CHECK_API_KEY;
    const url = `https://api-eu.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
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
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}
export default checkMailAddress;