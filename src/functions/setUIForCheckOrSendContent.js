import validateMailContent from './validateMailContent';
import checkMailExternals from './checkMailExternals';

/**
 * Generate a user interface message based on the email section content and validation results.
 * @param {string} mailSectionContent - The content of the email section.
 * @param {object} mailSectionResult - The result of the email validation.
 * @param {string} mailSection - The name of the email section (e.g., "subject", "message").
 * @returns {string} - The UI message to display.
 */
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

/**
 * Generate UI messages for email content validation.
 * @param {string} mailSubject - The subject of the email.
 * @param {string} mailMessage - The message body of the email.
 * @param {FileList} fileAttachments - The file attachments for the email.
 * @param {function} setSubjectResult - The function to call with the subject validation result.
 * @param {function} setMessageResult - The function to call with the message validation result.
 * @param {function} setFileAttachmentsResult - The function to call with the file attachments validation result.
 */
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