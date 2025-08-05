const crypto = require('crypto');
const fs = require('fs');

/**
 * Calculates the SHA256 hash of a file.
 * @param {string} filePath - Path to the file.
 * @returns {Promise<string>} - Resolves to the SHA256 hash in hex format.
 */
function getFileSHA256(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('error', reject);
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

/**
 * Checks links and attachments from an email message using VirusTotal API.
 * @param {string[]} urls - Array of URLs to check.
 * @param {string[]} attachments - Array of attachment file paths to check.
 * @returns {Promise<object[]>} - Array of results for each URL and attachment.
 */
async function checkMailExternals(urls, filePaths) {
    const fetch = require('node-fetch');
    const results = [];
    const attachments = [];

    // Check URLs
    for (const url of urls) {
        const response = await fetch('https://www.virustotal.com/api/v3/urls', {
            method: 'POST',
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `url=${encodeURIComponent(url)}`
        });
        const data = await response.json();
        results.push({
            type: 'url',
            input: url,
            analysis: data
        });
    }

    // Check attachments by hash (SHA256)
    for (const filePath of filePaths) {
        const hash = await getFileSHA256(filePath);
        attachments.push(hash);
        // Send the hash to VirusTotal for analysis
        const response = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
            method: 'GET',
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY
            }
        });
        const data = await response.json();
        results.push({
            type: 'attachment',
            input: hash,
            analysis: data
        });
    }

    return results;
}

export default checkMailExternals;