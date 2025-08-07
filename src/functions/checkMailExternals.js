
/**
 * Calculates the SHA256 hash of a file.
 * @param {string} filePath - Path to the file.
 * @returns {Promise<string>} - Resolves to the SHA256 hash in hex format.
 */
async function getFileSHA256Browser(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    // Convert buffer to hex string
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks links and attachments from an email message using VirusTotal API.
 * @param {string[]} urls - Array of URLs to check.
 * @param {string[]} attachments - Array of attachment file paths to check.
 * @returns {Promise<object[]>} - Array of results for each URL and attachment.
 */
async function checkMailExternals(urls, files) {
    const results = [];
    const attachments = [];

    // Check URLs
    if (urls.length > 0) 
        for (const url of urls) {
            const response = await fetch('https://www.virustotal.com/api/v3/urls', {
                method: 'POST',
                headers: {
                    'x-apikey': process.env.REACT_APP_VIRUSTOTAL_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `url=${encodeURIComponent(url)}`
            });
            const data = await response.json();

            const analysisId = data.data.id; // from the initial POST response
            const analysisResponse = await fetch(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                {
                    method: 'GET',
                    headers: {
                        'x-apikey': process.env.REACT_APP_VIRUSTOTAL_API_KEY
                    }
                }
            );
            const analysisData = await analysisResponse.json();
            console.log('URL analysis result:', analysisData);

            const verdict =
                analysisData &&
                analysisData.data &&
                analysisData.data.attributes &&
                analysisData.data.attributes.stats &&
                analysisData.data.attributes.stats.malicious > 0
                    ? analysisData.data.attributes.stats.malicious
                    : 0;

            results.push({attachment: url, verdict: verdict});
            
        }

    // Check attachments by hash (SHA256)
    if(files.length > 0)
        for (const file of files) {
            const hash = await getFileSHA256Browser(file);
            attachments.push(hash);
            // Send the hash to VirusTotal for analysis
            const response = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
                method: 'GET',
                headers: {
                    'x-apikey': process.env.REACT_APP_VIRUSTOTAL_API_KEY
                }
            });
            const data = await response.json();
            console.log('File analysis result:', data);
            if (data.error) 
                results.push({ attachment: file.name, verdict: 0 });
            else
                results.push({
                    attachment: file.name,
                    verdict: data.data.attributes.last_analysis_stats.malicious,
                });
        }

    return results;
}

export default checkMailExternals;