import '../form.css';
import { useState } from 'react';
import validateMailContent from '../../functions/validateMailContent';
import checkMailAddress from '../../functions/checkMailAddress';

function Send() {
    const [mailRecipients, setMailRecipients] = useState('');
    const [mailSubject, setMailSubject] = useState('');
    const [mailMessage, setMailMessage] = useState('');

    const [mailRecipientsResult, setMailRecipientsResult] = useState('');
    const [mailSubjectResult, setSubjectResult] = useState('');
    const [mailMessageResult, setMessageResult] = useState('');

    const [fileRecipients, setFileRecipients] = useState('');

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
                const isValid =
                    response.deliverability === 'DELIVERABLE' &&
                    response.quality_score > 0.8 &&
                    response.is_valid_format.value === true &&
                    response.is_free_email.value === true &&
                    response.is_disposable_email.value === false &&
                    response.is_catchall_email.value === false &&
                    response.is_role_email.value === false &&
                    response.is_smtp_valid.value === true;
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

        if (emails.length === 0) {
            setMailRecipientsResult('No recipients provided.');
            return;
        }

       const results = await checkAllAddressesSequentially(emails);

    const invalidAddresses = results.filter(r => !r.isValid).map(r => r.mailAddress);
    const uncheckedAddresses = results.filter(r => r.isValid === 'check failed').map(r => r.mailAddress);

    if (invalidAddresses.length > 0) {
        setMailRecipientsResult("Invalid mail address(es): " + invalidAddresses.join(', '));
    } 

    if (uncheckedAddresses.length > 0) {
        setMailRecipientsResult("Some mail addresses could not be checked: " + uncheckedAddresses.join(', '));
    }

    if (invalidAddresses.length == 0 && uncheckedAddresses.length == 0) {
        setMailRecipientsResult('The mail recipients are valid.');
    }

        if (mailSubject)
            if (validateMailContent(mailSubject))
                setSubjectResult("Mail subject contains fear, extreme joy, or spam indicators.");
            else
                setSubjectResult("Mail subject is valid.");
        else
            setSubjectResult('');
        if (mailMessage)
            if (validateMailContent(mailMessage))
                setMessageResult("Mail message contains fear, extreme joy, or spam indicators.");
            else
                setMessageResult("Mail message is valid.");
        else
            setMessageResult('');
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
                <input type="file" accept=".txt, .csv" />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Send;