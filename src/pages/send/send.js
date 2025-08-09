import '../form.css';
import { useState } from 'react';
import checkMailAddress from '../../functions/checkMailAddress';
import setUIForCheckOrSendContent from '../../functions/setUIForCheckOrSendContent';

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
        const results = [];
        setMailRecipientsResult(''); // Clear previous results

        const allRecipients = [mailRecipients, fileRecipients].filter(Boolean).join(',');
        const emails = allRecipients.split(/[\s,]+/).filter(Boolean);

       if(emails.length > 0 ) {

        const response = await fetch('/api/check-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emails })
        });
        const data = await response.json();
        if (data.existing && data.existing.length > 0) {
            results.push("These addresses already have an account: " + data.existing.join(', '));
            return;
        }
        if(data.nonexistent && data.nonexistent.length > 0) {
            const results = await checkAllAddressesSequentially(data.nonexistent);

            const invalidAddresses = results.filter(r => !r.isValid).map(r => r.mailAddress);
            const uncheckedAddresses = results.filter(r => r.isValid === 'check failed').map(r => r.mailAddress);

            if (invalidAddresses.length > 0) {
                results.push("Invalid mail address(es): " + invalidAddresses.join(', '));
            }

            if (uncheckedAddresses.length > 0) {
                results.push("Some mail addresses could not be checked: " + uncheckedAddresses.join(', '));
            }

            if (invalidAddresses.length === 0 && uncheckedAddresses.length === 0 && emails.length > 0) {
                setMailRecipientsResult('The mail recipients are valid.');
            }
        }
        if (data.error) {
            results.push("Error checking addresses: " + data.error);
            return;
        }

        if (emails.length === 0) {
            setMailRecipientsResult('No recipients provided.');
        }
        if (results.length > 0) {
            setMailRecipientsResult(results.join('\n'));
        }
    }

    setUIForCheckOrSendContent(mailSubject, mailMessage, fileAttachments, setSubjectResult, setMessageResult, setFileAttachmentsResult);
    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipients: emails,
                subject: mailSubject,
                message: mailMessage,
                attachments: fileAttachments
            })
        });
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        // Handle successful send
    } catch (error) {
        console.error('Error sending email:', error);
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