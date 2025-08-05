import '../form.css'

function Send() {
    return (
        <div className="send">
        <h1>Send Page</h1>
        <form>
            <input type="text" placeholder="Add recipinets manually" />
            or load recipinets list from file
            <input type="file" accept=".txt, .csv" />
            <input type="text" placeholder="Subject" />
            <textarea placeholder="Message"></textarea>
            <button type="submit">Send</button>
        </form>
        </div>
    );
}

export default Send;