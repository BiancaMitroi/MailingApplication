import '../form.css';

function Check() {
  return (
    <div className="check">
      <h1>Check Page</h1>
      <form>
        <input type="text" placeholder="Sender mail address" />
        <input type="text" placeholder="Subject" />
        <textarea placeholder="Message"></textarea>
        <button type="submit">Check</button>
      </form>
    </div>
  );
}

export default Check;