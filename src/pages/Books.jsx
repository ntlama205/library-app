import { useState } from "react";
import BookForm from "../components/BookForm";

export default function Books({ books, setBooks, user }) {
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");
  const admin = user.role === "admin";
  const s = q.toLowerCase();
  const list = books.filter((b) => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s) || b.isbn.includes(s));

  const save = (book) => {
    if (editing) {
      setBooks(books.map((b) => (b.isbn === editing.isbn ? book : b)));
      setEditing(null);
    } else {
      if (books.some((b) => b.isbn === book.isbn)) return "A book with this ISBN already exists.";
      setBooks([...books, book]);
    }
    return "";
  };

  const remove = (isbn) => {
    if (confirm("Are you sure you want to remove this book?")) setBooks(books.filter((b) => b.isbn !== isbn));
  };

  return (
    <section className="page active">
      <h2>Book Management</h2>
      <p className="deck">Catalog a new title, or update one already on the shelf.</p>
      {admin && <BookForm editing={editing} onSave={save} />}
      <div className="search-row">
        <input type="text" placeholder="Search by title, author, or ISBN…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <table>
        <thead><tr>{["Title", "Author", "Genre", "ISBN", "Qty", "Actions"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {list.length === 0 ? (
            <tr className="empty-row"><td colSpan={6}>No books cataloged.</td></tr>
          ) : list.map((b) => (
            <tr key={b.isbn}>
              <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.isbn}</td><td>{b.qty}</td>
              <td>
                {admin ? (
                  <>
                    <button onClick={() => setEditing(b)}>Edit</button>
                    <button className="danger" onClick={() => remove(b.isbn)}>Delete</button>
                  </>
                ) : "View Only"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
