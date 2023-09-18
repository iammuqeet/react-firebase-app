import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
//   onSnapshot
} from "firebase/firestore";

import "./App.css";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const App = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);

  initializeApp(firebaseConfig);
  //db connection with firebase
  const db = getFirestore();

  //collection reference
  const colRef = collection(db, "books");


  useEffect(() => {
    handleFetchBooks();
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addDoc(colRef, {
      title,
      author,
    }).then(() => {
      setTitle("");
      setAuthor("");
      handleFetchBooks();
    });
  };

  //get all books
  const handleFetchBooks = () => {
    getDocs(colRef)
      .then((snapshot) => {
        let books = [];
        snapshot.docs.forEach((doc) => {
          books.push({ ...doc.data(), id: doc.id });
        });
        setBooks(books); // Update the books state
      })
      .catch((err) => console.log(err.message));
  };

  const handleDelete = (bookId) => {
    const decRef = doc(db, "books", bookId);
    deleteDoc(decRef);
    handleFetchBooks();
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">Books List</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title" className="label">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="author" className="label">
              Author:
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={handleAuthorChange}
              required
              className="input"
            />
          </div>
          <button type="submit" className="button">
            Add Book
          </button>
        </form>

        <button onClick={handleFetchBooks} className="fetch-button">
          Fetch Books
        </button>
      </div>
      <div className="bookCard">
        <ul className="books-list">
          {books.map((book) => (
            <li key={book.id} className="book-card">
              <div className="book-content">
                <div className="book-title">{book.title}</div>
                <div className="book-author">by {book.author}</div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
