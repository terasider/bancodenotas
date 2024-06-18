document.getElementById('add-note').addEventListener('click', addNote);
document.getElementById('add-database').addEventListener('click', addDatabase);
document.getElementById('delete-database').addEventListener('click', deleteDatabase);
document.getElementById('apply-filters').addEventListener('click', applyFilters);
document.getElementById('clear-filters').addEventListener('click', clearFilters);
document.getElementById('database-selector').addEventListener('change', loadNotes);
window.addEventListener('load', loadDatabases);

function getSelectedDatabase() {
    const selector = document.getElementById('database-selector');
    return selector.options[selector.selectedIndex].value;
}

function addDatabase() {
    const newDatabaseName = document.getElementById('new-database').value.trim();
    if (!newDatabaseName) {
        alert('Por favor, insira um nome para o banco de notas!');
        return;
    }

    const databases = JSON.parse(localStorage.getItem('databases')) || [];
    if (databases.includes(newDatabaseName)) {
        alert('Este banco de notas já existe!');
        return;
    }

    databases.push(newDatabaseName);
    localStorage.setItem('databases', JSON.stringify(databases));

    const selector = document.getElementById('database-selector');
    const option = document.createElement('option');
    option.value = newDatabaseName;
    option.textContent = newDatabaseName;
    selector.appendChild(option);
    selector.value = newDatabaseName; // Select the new database

    document.getElementById('new-database').value = '';
    loadNotes(); // Load notes for the new database
}

function deleteDatabase() {
    const database = getSelectedDatabase();
    if (database === 'default') {
        alert('Você não pode excluir o banco de notas padrão!');
        return;
    }

    let databases = JSON.parse(localStorage.getItem('databases')) || [];
    databases = databases.filter(db => db !== database);
    localStorage.setItem('databases', JSON.stringify(databases));

    localStorage.removeItem(database);

    const selector = document.getElementById('database-selector');
    selector.removeChild(selector.options[selector.selectedIndex]);
    selector.value = 'default'; // Select the default database

    loadNotes(); // Load notes for the default database
}

function addNote() {
    const category = document.getElementById('note-category').value.trim();
    const url = document.getElementById('note-url').value.trim();
    const content = document.getElementById('note-content').value.trim();
    if (!category || !content || !url) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const note = { category, url, content };
    saveNoteToLocalStorage(note);
    displayNote(note);

    // Limpar os campos de entrada
    document.getElementById('note-category').value = '';
    document.getElementById('note-url').value = '';
    document.getElementById('note-content').value = '';
}

function saveNoteToLocalStorage(note) {
    const database = getSelectedDatabase();
    let notes = JSON.parse(localStorage.getItem(database)) || [];
    notes.push(note);
    localStorage.setItem(database, JSON.stringify(notes));
}

function loadDatabases() {
    const databases = JSON.parse(localStorage.getItem('databases')) || ['default'];
    const selector = document.getElementById('database-selector');
    selector.innerHTML = '';

    databases.forEach(database => {
        const option = document.createElement('option');
        option.value = database;
        option.textContent = database;
        selector.appendChild(option);
    });

    loadNotes(); // Load notes for the initially selected database
}

function loadNotes() {
    const database = getSelectedDatabase();
    let notes = JSON.parse(localStorage.getItem(database)) || [];
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    notes.forEach(displayNote);
}

function displayNote(note) {
    const notesContainer = document.getElementById('notes-container');

    const noteElement = document.createElement('div');
    noteElement.className = 'note';

    const categoryElement = document.createElement('div');
    categoryElement.className = 'note-category';
    categoryElement.textContent = note.category;

    const urlElement = document.createElement('a');
    urlElement.className = 'note-url';
    urlElement.href = note.url;
    urlElement.textContent = note.url;
    urlElement.target = '_blank';

    const contentElement = document.createElement('div');
    contentElement.className = 'note-content';
    contentElement.textContent = note.content;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => {
        deleteNote(note);
        notesContainer.removeChild(noteElement);
    });

    noteElement.appendChild(categoryElement);
    noteElement.appendChild(urlElement);
    noteElement.appendChild(contentElement);
    noteElement.appendChild(deleteButton);
    notesContainer.appendChild(noteElement);
}

function deleteNote(noteToDelete) {
    const database = getSelectedDatabase();
    let notes = JSON.parse(localStorage.getItem(database)) || [];
    notes = notes.filter(note => note !== noteToDelete);
    localStorage.setItem(database, JSON.stringify(notes));
}

function applyFilters() {
    const categoryFilter = document.getElementById('filter-category').value.trim().toLowerCase();
    const urlFilter = document.getElementById('filter-url').value.trim().toLowerCase();

    const database = getSelectedDatabase();
    const notes = JSON.parse(localStorage.getItem(database)) || [];
    const filteredNotes = notes.filter(note =>
        (categoryFilter === '' || note.category.toLowerCase().includes(categoryFilter)) &&
        (urlFilter === '' || note.url.toLowerCase().includes(urlFilter))
    );

    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    filteredNotes.forEach(displayNote);
}

function clearFilters() {
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-url').value = '';
    loadNotes();
}
