import '../form.css';
import validateMailContent from '../../functions/validateMailContent';
import checkMailAddress from '../../functions/checkMailAddress';
import checkMailExternals from '../../functions/checkMailExternals';
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
      checkMailAddress(mailAddress, (responseText) => {
        const response = JSON.parse(responseText);
        const isValid = response.status === 'valid';
        if (!isValid) {
          setMailAddressResult("Invalid mail address.");
        } else {
          setMailAddressResult('The mail address is valid.');
        }
      });
    } else {
      setMailAddressResult('');
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