function validateMailContent(email) {
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

    return containsFear || containsExtremeJoy || containsSpam;
}
export default validateMailContent;