function showConfirmation(bookId) {
    // Показываем форму подтверждения
    document.getElementById(`delete-form-${bookId}`).style.display = "block";
}

function hideConfirmation(bookId) {
    // Скрываем форму подтверждения
    document.getElementById(`delete-form-${bookId}`).style.display = 'none';
}