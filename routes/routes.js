const express = require('express');

const router = express.Router();

const app = require("../app.js");
let books = app.books; // получаем книги


router.get("/", (req, res) => {
    res.render("index");
});


router.get("/library", (req, res) => {
    res.render("library", {books : books});
});

router.get("/library/filter", (req, res) => {
   const status = req.query.status;
   let filteredBooks = books;

   if (status === "available") {
       filteredBooks = books.filter(book => book.available);
   } else if (status === "overdue") {
       filteredBooks = books.filter(book => !book.available && book.returnDate < new Date().toISOString().split('T')[0]);
   }
   res.json({books: filteredBooks});
});


// переходим на форму добавления книги
router.get("/library/add", (req, res) => {
    res.render("add_book");
});


// добавление книги заполнили форму отправили POST
router.post("/library/add", (req, res) => {
    const {title, author, publicationDate} = req.body;
    const newBook = {
        id: books.length + 1,
        title: title,
        author: author,
        publicationDate: publicationDate,
        available: true,
        borrower: null,
        returnDate: null
    };

    books.push(newBook);
    res.redirect("/library");
});


// удаление книги
router.post("/library/delete/:id", (req, res) => {
    const bookId = req.params.id;
    // находим книгу по ID и удаляем её из массива books и из файла JSON
    const bookIndex = books.findIndex(book => book.id === parseInt(bookId));

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1); // Удаляем книгу

        res.redirect("/library");
    } else {
        return res.status(404).send("Книга не найдена."); // Книга не найдена
    }
});


// информация о книге
router.get("/library/info/:id", (req, res) => {
   const bookId = req.params.id;
   const book = books.find(book => book.id === parseInt(bookId));

    // Получаем query-параметр 'error' при возврате книги если он существует
    const errorMessage = req.query.error || null;

   if (book) {
       res.render("book_info", {book: book, errorMessage: errorMessage});
   }else{
       return res.status(404).send("Книга не найдена.");
   }
});


// форма редактирование книги
router.get("/library/edit/:id", (req, res) => {
    const bookId = req.params.id;
    const book = books.find(book => book.id === parseInt(bookId));
    if (book) {
        res.render("edit_book", {book: book});
    } else {
        return res.status(404).send("Книга не найдена.");
    }
});


// редактирование книги
router.post("/library/edit/:id", (req, res) => {
   const bookId = req.params.id;
   const {title, author, publicationDate} = req.body;
   const book = books.find(book => book.id === parseInt(bookId));

   if (book) {
       book.title = title;
       book.author = author;
       book.publicationDate = publicationDate;

       res.redirect(`/library/info/${bookId}`);
   } else {
       return res.status(404).send("Книга не найдена");
   }
});


// ПОСТ на выдачу книги
router.post("/library/borrow/:id", (req, res) => {
    const bookId = req.params.id;
    const { userName } = req.body;

    const book = books.find(book => book.id === parseInt(bookId));

    if (book) {
        book.available = false;
        book.borrower = userName;

        // toISOstring ****-**-**T....
        book.returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        res.redirect(`/library/info/${bookId}`);
    } else {
        return res.status(404).send("Книга не найдена");
    }
});


// ПОСТ на возврат книги
router.post("/library/return/:id", (req, res) => {
    const bookId = req.params.id;
    const {userName} = req.body;
    const book = books.find(book => book.id === parseInt(bookId));

    if (book) {
        if (book.borrower === userName) {
            book.available = true;
            book.borrower = null;
            book.returnDate = null;

            res.redirect(`/library/info/${bookId}`);
        } else {
            res.redirect(`/library/info/${bookId}?error=1`); // query параметр error
        }
    } else {
        return res.status(404).send("Книга не надена");
    }
});


router.get("*", (req,res)=>{
    res.status(404);
    res.end("Page Not Found");
});

module.exports = router;