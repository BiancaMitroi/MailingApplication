import checkMailExternals from '../functions/checkMailExternals';

async function validateMailContent(email) {
    const fearWords = ['panic', 'terror', 'scared', 'frightened', 'horror', 'afraid', 'dread', 'alarm', 'fear'];
    const joyWords = ['ecstatic', 'elated', 'thrilled', 'overjoyed', 'delighted', 'joyful', 'bliss', 'euphoric', 'happy'];
    const spamIndicators = [
        'free', 'winner', 'congratulations', 'click here', 'urgent', 'act now', 'limited time', 'guaranteed',
        'risk free', 'prize', 'money', 'cash', 'offer', 'buy now', 'order now', 'credit', 'cheap', 'discount'
    ];

    const message = String(email).toLowerCase();

    const containsFear = fearWords.some(word => message.includes(word));
    const containsExtremeJoy = joyWords.some(word => message.includes(word));
    const containsSpam = spamIndicators.some(word => message.includes(word));

    const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
    const links = message.match(urlRegex) || [];

    let linksResult = [];
    if (links.length > 0) {
        linksResult = await checkMailExternals(links, []);
    }

    const results = {
        containsFear: containsFear,
        containsExtremeJoy: containsExtremeJoy,
        containsSpam: containsSpam,
        linksResult: linksResult.filter(r => r.verdict > 0).map(r => r.attachment) // Filter out only malicious links
    };

    return results;
}
export default validateMailContent;