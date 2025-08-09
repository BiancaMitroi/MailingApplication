import '../form.css';
import { useState, useEffect } from 'react';
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

    const handleRecipientsChange = (e) => {
        setMailRecipients(e.target.value);
    };

     const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const results = [];
        setMailRecipientsResult('');

        const allRecipients = [mailRecipients, fileRecipients].filter(Boolean).join(',');
        const emails = allRecipients.split(/[\s,]+/).filter(Boolean);

       if(emails.length > 0 ) {
        try{
            const response = await fetch('http://127.0.0.1:8000/api/check-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('authToken')}`
             },
            body: JSON.stringify({ emails })
        });
        const data = await response.json();
        if (!response.ok) {
            setMailRecipientsResult('Error checking addresses: ' + data.error);
            return;
        }
        console.log("checkResponse", data);
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
        } catch (error) {
            setMailRecipientsResult('Error checking addresses: ' + error.message);
            console.error("Error checking addresses:", error);
        }
        
    

    setUIForCheckOrSendContent(mailSubject, mailMessage, fileAttachments, setSubjectResult, setMessageResult, setFileAttachmentsResult);
    
    try {
        const response = await fetch('http://127.0.0.1:8000/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('authToken')}`
             },
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
        setFileAttachmentsResult('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
};

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

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