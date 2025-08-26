import '../form.css';
import {checkMailAddress} from '../../functions/checkMailAddress';
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

    if (mailAddress) {

      try {
        const checkResponse = await fetch(`http://127.0.0.1:8000/api/check-user?email=${encodeURIComponent(mailAddress)}`);
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (checkData.exists) {
            setMailAddressResult('The mail address is valid.');
            return;
          } else {
             const response = await checkMailAddress(mailAddress);
             console.log("checkMailAddress response:", response);
             const isValid = response.Status === 'Valid';
             if (!isValid) {
               setMailAddressResult("Invalid mail address.");
             } else {
               setMailAddressResult('The mail address is valid.');
             }
           }
         }
      } catch {
        setMailAddressResult('Could not check if user exists. Please try again.');
        return;
      }
    } else {
      setMailAddressResult('No email address provided.');
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