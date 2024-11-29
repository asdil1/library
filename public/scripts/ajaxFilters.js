// фильтр
function fetchBooks(url){
    fetch(url, {method: "GET"}) // отправляем запрос
        .then(response => response.json()) // обработка промиса, который вернул fetch
        .then(data => {
            updateBookList(data.books); // обрабатываем данные ответа
        }).catch(error => console.log("Ошибка: " ,error));
}


function updateBookList(books){
    const container = document.querySelector(".container");
    container.innerHTML = '';

    books.forEach(book => {
       const bookItem = document.createElement("div");
       bookItem.className = "book-item";
       bookItem.innerHTML = `
            <p>Название: ${book.title}</p>
            <p>Автор: ${book.author}</p>
            <p>Год: ${book.publicationDate}</p>
            <div class="action-buttons">
                <a href="/library/info/${book.id}" class="select-button">
                    <i class="fa-solid fa-pencil"></i>
                </a>
                <button type="button" class="delete-button" onclick="showConfirmation('${book.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
                
                <!-- Форма подтверждения удаления -->
                <form id="delete-form-${book.id}" style="display:none;" action="/library/delete/${book.id}" method="POST">
                    <p class="form-paragraph">Вы уверены, что хотите удалить эту книгу?</p>
                    <button class="delete-book-button" type="submit">Да</button>
                    <button type="button" onclick="hideConfirmation('${book.id}')">Нет</button>
                </form>
            </div>
        `;
       container.appendChild(bookItem);
    });
}