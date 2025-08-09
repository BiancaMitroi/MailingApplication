import '../form.css';
import checkMailAddress from '../../functions/checkMailAddress';
import setUIForCheckOrSendContent from '../../functions/setUIForCheckOrSendContent';
import { useState } from 'react';

function Check() {

  const [mailAddress, setMailAddress] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [fileAttachments, setFileAttachments] = useState([]);
  const [mailAddressResult, setMailAddressResult] = useState('');
  const [mailSubjectResult, setSubjectResult] = useState('');
  const [mailMessageResult, setMessageResult] = useState('');
  const [fileAttachmentsResult, setFileAttachmentsResult] = useState([]);

  const handleCheck = async (event) => {
    event.preventDefault();

    
    // const uncheckedFiles = fileAttachments.filter(f => r.verdict === 'check failed').map(f => f.attachment);

    if (mailAddress) {

      try {
        const checkResponse = await fetch(`/api/check-user?email=${encodeURIComponent(mailAddress)}`);
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (checkData.exists) {
            setMailAddressResult('An account with this email already exists.');
            return;
          } else {
             checkMailAddress(mailAddress, (responseText) => {
                const response = JSON.parse(responseText);
                const isValid = response.status === 'valid';
                if (!isValid) {
                setMailAddressResult("Invalid mail address.");
                } else {
                setMailAddressResult('The mail address is valid.');
                }
            });
          }
        }
      } catch {
        setMailAddressResult('Could not check if user exists. Please try again.');
        return;
      }
    } else {
      setMailAddressResult('');
    }

    setUIForCheckOrSendContent(mailSubject, mailMessage, fileAttachments, setSubjectResult, setMessageResult, setFileAttachmentsResult);
    
  }

  return (
    <div className="check">
      <h1>Check Page</h1>
      <form onSubmit={handleCheck}>
        {mailAddressResult && <div className="error">{mailAddressResult}</div>}
        <input type="email" placeholder="Sender mail address" value={mailAddress} onChange={e => setMailAddress(e.target.value)} />
        {mailSubjectResult && <div className="error">{mailSubjectResult}</div>}
        <input type="text" placeholder="Subject" value={mailSubject} onChange={e => setMailSubject(e.target.value)} />
        {mailMessageResult && <div className="error">{mailMessageResult}</div>}
        <textarea placeholder="Message" value={mailMessage} onChange={e => setMailMessage(e.target.value)}></textarea>
        Attachments:
        {fileAttachmentsResult && <div className="error">{fileAttachmentsResult}</div>}
        <input type="file" multiple onChange={(e) => setFileAttachments(e.target.files)} />
        <button type="submit">Check</button>
      </form>
    </div>
  );
}

export default Check;