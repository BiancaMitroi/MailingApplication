import validateMailContent from './validateMailContent';
import checkMailExternals from './checkMailExternals';

function uiMessage(mailSectionContent, mailSectionResult, mailSection){
    if (mailSectionContent)
      if (mailSectionResult.containsExtremeJoy || mailSectionResult.containsFear || mailSectionResult.containsSpam || mailSectionResult.linksResult.length > 0){
        const statusSpamMessage = mailSectionResult.containsExtremeJoy || mailSectionResult.containsFear || mailSectionResult.containsSpam ? `Mail ${mailSection} contains: inappropriate content. (spam, fear, extreme joy)` : '';
        const statusLinksMessage = mailSectionResult.linksResult.length > 0 ? `Mail ${mailSection} contains malicious links: ${mailSectionResult.linksResult}` : '';
        return `${statusSpamMessage || ''} ${statusLinksMessage || ''}`.trim();
      } else
        return `Mail ${mailSection} is valid.`;
    else
      return '';
}

async function setUIForCheckOrSendContent(mailSubject, mailMessage, fileAttachments, setSubjectResult, setMessageResult, setFileAttachmentsResult) {
    const mailSubjectResult = await validateMailContent(mailSubject);
    const mailContentResult = await validateMailContent(mailMessage);

    setSubjectResult(uiMessage(mailSubject, mailSubjectResult, 'subject'));
    setMessageResult(uiMessage(mailMessage, mailContentResult, 'message'));

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
export default setUIForCheckOrSendContent;