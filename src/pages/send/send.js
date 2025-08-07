import '../form.css';
import { useState } from 'react';
import validateMailContent from '../../functions/validateMailContent';
import checkMailAddress from '../../functions/checkMailAddress';
import checkMailExternals from '../../functions/checkMailExternals';

function Send() {
    const [mailRecipients, setMailRecipients] = useState('');
    const [mailSubject, setMailSubject] = useState('');
    const [mailMessage, setMailMessage] = useState('');
    const [fileAttachments, setFileAttachments] = useState([]);

    const [mailRecipientsResult, setMailRecipientsResult] = useState('');
    const [mailSubjectResult, setSubjectResult] = useState('');
    const [mailMessageResult, setMessageResult] = useState('');

    const [fileRecipients, setFileRecipients] = useState('');
    const [fileAttachmentsResult, setFileAttachmentsResult] = useState([]);

    // Handle manual input of multiple addresses (comma or newline separated)
    const handleRecipientsChange = (e) => {
        setMailRecipients(e.target.value);
    };

     const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            // Split by comma, newline, or whitespace
            const text = event.target.result;
            const emails = text.split(/[\s,]+/).filter(Boolean);
            setFileRecipients(emails.join(','));
        };
        reader.readAsText(file);
    };

    function checkMailAddressPromise(email) {
        return new Promise(resolve => {
            checkMailAddress(email, (responseText) => {
                resolve(JSON.parse(responseText));
            });
        });
    }

    async function checkAllAddressesSequentially(emails, delayMs = 1200) {
        const results = [];
        for (const mailAddress of emails) {
            // Wait before each request to avoid rate limit
            await new Promise(resolve => setTimeout(resolve, delayMs));
            const response = await checkMailAddressPromise(mailAddress);
            if (response.error) {
                results.push({ mailAddress, isValid: 'check failed' });
            } else {
                const isValid = response.status === 'valid'
                results.push({ mailAddress, isValid });
            }
        }
        return results;
    }

    // Example submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMailRecipientsResult(''); // Clear previous results

        const allRecipients = [mailRecipients, fileRecipients].filter(Boolean).join(',');
        const emails = allRecipients.split(/[\s,]+/).filter(Boolean);

       if(emails.length > 0 ) {
        const results = await checkAllAddressesSequentially(emails);

        const invalidAddresses = results.filter(r => !r.isValid).map(r => r.mailAddress);
        const uncheckedAddresses = results.filter(r => r.isValid === 'check failed').map(r => r.mailAddress);

        if (invalidAddresses.length > 0) {
            setMailRecipientsResult("Invalid mail address(es): " + invalidAddresses.join(', '));
        } 

        if (uncheckedAddresses.length > 0) {
            setMailRecipientsResult("Some mail addresses could not be checked: " + uncheckedAddresses.join(', '));
        }

        if (invalidAddresses.length == 0 && uncheckedAddresses.length == 0 && emails.length > 0) {
            setMailRecipientsResult('The mail recipients are valid.');
        }

        if (emails.length === 0) {
            setMailRecipientsResult('No recipients provided.');
        }
       }

    const mailContentResult = await validateMailContent(mailMessage);
    const mailSubjectResult = await validateMailContent(mailSubject);
    if (mailSubject)
      if (mailSubjectResult.containsExtremeJoy || mailSubjectResult.containsFear || mailSubjectResult.containsSpam || mailSubjectResult.linksResult.length > 0){
        const statusSpamMessage = mailSubjectResult.containsExtremeJoy || mailSubjectResult.containsFear || mailSubjectResult.containsSpam ? `Mail subject contains: inappropriate content. (spam, fear, extreme joy)` : '';
        const statusLinksMessage = mailSubjectResult.linksResult.length > 0 ? `Mail subject contains malicious links: ${mailSubjectResult.linksResult}` : '';
        setSubjectResult(`${statusSpamMessage || ''} ${statusLinksMessage || ''}`.trim());
      } else
        setSubjectResult("Mail subject is valid.");
    else
      setSubjectResult('');
    if (mailMessage)
      if (mailContentResult.containsExtremeJoy || mailContentResult.containsFear || mailContentResult.containsSpam || mailContentResult.linksResult.length > 0)
        setMessageResult(`Mail message contains: inappropriate content. (spam, fear, extreme joy): ${mailContentResult.containsExtremeJoy || mailContentResult.containsFear || mailContentResult.containsSpam}\n and/or malicious links: ${mailContentResult.linksResult}`);
      else
        setMessageResult("Mail message is valid.");
    else
      setMessageResult('');

        if (fileAttachments.length > 0) {
            const files = Array.from(fileAttachments);
            try {
                const results = await checkMailExternals([], files);
                // Find malicious files (example: verdict or analysis logic)
                const maliciousFiles = results
                    .filter(r => {
                    console.log('Result:', r.verdict);
                    return r.verdict && r.verdict > 0; // Adjust this condition based on actual response structure
                    })
                    .map((r) => r.attachment);
                console.log('Malicious files:', maliciousFiles);
                if (maliciousFiles.length > 0) {
                    setFileAttachmentsResult(`Malicious attachments found: ${maliciousFiles.join(', ')}`);
                } else {
                    setFileAttachmentsResult('All files are good.');
                }
            } catch (error) {
                setFileAttachmentsResult('Error checking attachments.');
                console.error('Error checking attachments:', error);
            }
        } else {
            setFileAttachmentsResult('');
        }
    };

    return (
        <div className="send">
            <h1>Send Page</h1>
            <form onSubmit={handleSubmit}>
                {mailRecipientsResult && <div className="error">{mailRecipientsResult}</div>}
                <textarea
                    placeholder="Add recipients manually (comma or newline separated)"
                    value={mailRecipients}
                    onChange={handleRecipientsChange}
                    rows={3}
                />
                <div>or load recipients list from file</div>
                <input type="file" accept=".txt, .csv" onChange={handleFileChange} />
                {mailSubjectResult && <div className="error">{mailSubjectResult}</div>}
                <input
                    type="text"
                    placeholder="Subject"
                    value={mailSubject}
                    onChange={e => setMailSubject(e.target.value)}
                />
                {mailMessageResult && <div className="error">{mailMessageResult}</div>}
                <textarea
                    placeholder="Message"
                    value={mailMessage}
                    onChange={e => setMailMessage(e.target.value)}
                ></textarea>
                Attachments:
                {fileAttachmentsResult && <div className="error">{fileAttachmentsResult}</div>}
                <input type="file" multiple onChange={(e) => setFileAttachments(e.target.files)} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Send;