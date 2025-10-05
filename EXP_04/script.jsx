import React, { useState } from "react";

export default function LibraryApp() {
  const [books, setBooks] = useState([
    { id: 1, title: "JavaScript: The Good Parts", author: "Douglas Crockford" },
    { id: 2, title: "Clean Code", author: "Robert C. Martin" },
    { id: 3, title: "You Don’t Know JS", author: "Kyle Simpson" },
  ]);

  const [search, setSearch] = useState("");
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [editId, setEditId] = useState(null);


  const addBook = (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) return;

    if (editId) {

      setBooks(
        books.map((book) =>
          book.id === editId ? { ...book, ...newBook } : book
        )
      );
      setEditId(null);
    } else {

      setBooks([
        ...books,
        { id: Date.now(), title: newBook.title, author: newBook.author },
      ]);
    }
    setNewBook({ title: "", author: "" });
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );


  const editBook = (book) => {
    setNewBook({ title: book.title, author: book.author });
    setEditId(book.id);
  };


  const deleteBook = (id) => {
    setBooks(books.filter((b) => b.id !== id));
  };


  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h2>📚 Library Management System</h2>

      {}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "5px", marginBottom: "15px", width: "250px" }}
      />

      {}
      <form onSubmit={addBook} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Book Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "5px 10px" }}>
          {editId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {}
      <h3>Book List</h3>
      {filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredBooks.map((book) => (
            <li
              key={book.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "5px",
              }}
            >
              <strong>{book.title}</strong> by {book.author}
              <div style={{ marginTop: "5px" }}>
                <button
                  onClick={() => editBook(book)}
                  style={{ marginRight: "10px" }}
                >
                  ✏️ Edit
                </button>
                <button onClick={() => deleteBook(book.id)}>🗑️ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
