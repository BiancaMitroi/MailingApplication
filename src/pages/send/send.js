import '../form.css';
import { useState } from 'react';
import {checkMailAddresses} from '../../functions/checkMailAddress';
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
        if(response.ok) {
            if(data.nonexistent && data.nonexistent.length > 0) {
                const results = await checkMailAddresses(data.nonexistent);

                const invalidAddresses = results.filter(r => r.status !== "Valid").map(r => r.mailAddress);
                const uncheckedAddresses = results.filter(r => r.status === "false").map(r => r.mailAddress);

                if (invalidAddresses.length > 0) {
                    results.push("Invalid mail address(es): " + invalidAddresses.join(', '));
                }

                if (uncheckedAddresses.length > 0) {
                    results.push("Some mail addresses could not be checked: " + uncheckedAddresses.join(', '));
                }

                if (invalidAddresses.length === 0 && emails.length > 0) {
                    setMailRecipientsResult('The mail recipients are valid.');
                }
            }

            
            if (results.length > 0) {
                setMailRecipientsResult(results.join('\n'));
            }
        } else {
            if(data.error.includes('Invalid access token')) {
                window.location.href = '/login';
            } else {
                setMailRecipientsResult('Error checking addresses: ' + data.error);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }

    setUIForCheckOrSendContent(mailSubject, mailMessage, fileAttachments, setSubjectResult, setMessageResult, setFileAttachmentsResult);
    console.log("After setUIForCheckOrSendContent", fileAttachments);
    try {
        const formData = new FormData();
        formData.append('recipients', emails);
        formData.append('subject', mailSubject);
        formData.append('message', mailMessage);

        // Attach files
        for (let i = 0; i < fileAttachments.length; i++) {
            formData.append('attachments', fileAttachments[i]);
        }

        const response = await fetch('http://127.0.0.1:8000/api/send', {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('authToken')}`
                // Do NOT set 'Content-Type'; browser will set it automatically for FormData
            },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            setMailRecipientsResult('Email sent successfully.');
        } else {
            if (data.error && data.error.includes('Invalid access token')) {
                setMailRecipientsResult('You are logged out. Please log in again.');
            } else {
                setMailRecipientsResult('Error sending email: ' + (data.error || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error("Error sending email:", error);
        setMailRecipientsResult('Error sending email: ' + error.message);
    }
} else {
    setMailRecipientsResult('No recipients provided.');  
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