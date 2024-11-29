const express = require('express');

const app = express();

// Добавляем middleware для обработки данных формы
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware для парсинга JSON

app.use(express.static("./public")); // статика

app.set("view engine", "pug"); // подлкючаем обработчик шаблонов pug
app.set("views", "./views"); // шаблоны в папке views


const books = require("./data/books.json"); // получаем джсон книг парсится само
module.exports.books = books;

const router = require('./routes/routes');
app.use("/", router); // указываем что используем маршрутизатор с корня
app.listen(3000);