import '../form.css';
import validateMailContent from '../../functions/validateMailContent';
import checkMailAddress from '../../functions/checkMailAddress';
import { useState } from 'react';

function Check() {

  const [mailAddress, setMailAddress] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [mailAddressResult, setMailAddressResult] = useState('');
  const [mailSubjectResult, setSubjectResult] = useState('');
  const [mailMessageResult, setMessageResult] = useState('');

  const handleCheck = (event) => {
    event.preventDefault();
    if (mailAddress) {
      checkMailAddress(mailAddress, (responseText) => {
        const response = JSON.parse(responseText);
        const isValid =
          response.deliverability === 'DELIVERABLE' &&
          response.is_valid_format.value === true &&
          response.is_free_email.value === true &&
          response.is_disposable_email.value === false &&
          response.is_catchall_email.value === false &&
          response.is_role_email.value === false &&
          response.is_smtp_valid.value === true;
        if (!isValid) {
          setMailAddressResult("Invalid mail address.");
        } else {
          setMailAddressResult('The mail address is valid.');
        }
      });
    } else {
      setMailAddressResult('');
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
        <input type="file" accept=".txt, .csv" />
        <button type="submit">Check</button>
      </form>
    </div>
  );
}

export default Check;