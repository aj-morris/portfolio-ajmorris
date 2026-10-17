// This is beginning of the JS file

let favorites = [];

const form = document.getElementById('add-favorite-form');
const favoritesList = document.getElementById('favorites-list');

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const ratingFilter = document.getElementById('rating-filter');
const favoritesClear = document.getElementById('favorites-clear');

function addFavorite(event) {
    event.preventDefault();

    const name = document.getElementById ('name').value.trim();
    const category = document.getElementById('category').value;

   if (!name || !category) {
    document.getElementById('form-error').textContent = 'Error. Forgot to fill out completely. ' ;
    return;
}

    const newFavorite = {
        name: name,
        category: category,
        rating: parseInt(document.getElementById('rating').value),
        notes: document.getElementById('notes').value.trim(),
        dateAdded: new Date().toLocaleDateString()
    };

    favorites.push(newFavorite);
    saveFavorites();
    form.reset();
    displayFavorites();
}


form.addEventListener('submit', addFavorite);
function saveFavorites() {
    try {
        localStorage.setItem('localFavorites', JSON.stringify(favorites));
    } catch (error) {
        alert('Unable to save favorites. Storage may be disabled.');
    }
}
function loadFavorites() {
    try {
        const saved = localStorage.getItem('localFavorites');
        if (saved) {
            favorites = JSON.parse(saved);
        } else {
            favorites = [];
        }
    } catch (error) {
        favorites = [];
    }
}

function displayFavorites() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    ratingFilter.value = 'all';
    searchFavorites();
}

function deleteFavorite(index) {
    const favorite = favorites[index];
    if (confirm(`Delete "${favorite.name}"?`)) {
        favorites.splice(index, 1);   // remove 1 item at index
        saveFavorites();
        searchFavorites();            // re-render, keeping current filter
    }
}

function clearAllFavorites () {
    if (confirm(`Are you sure you want to delete all favorites?`)) {
        favorites = []; 
        saveFavorites();
        searchFavorites();
    }}

searchInput.addEventListener('input', searchFavorites);
categoryFilter.addEventListener('change', searchFavorites);
ratingFilter.addEventListener ('change', searchFavorites);
favoritesClear.addEventListener ('click', clearAllFavorites);

function searchFavorites() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedRating = ratingFilter.value;
   
    const filtered = favorites.filter(function(favorite) {
        const matchesSearch = searchText === '' ||
            favorite.name.toLowerCase().includes(searchText) ||
            favorite.notes.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === 'all' ||
            favorite.category === selectedCategory;
        const matchesRating = selectedRating === 'all' ||
            favorite.rating === parseInt(selectedRating);
              return matchesSearch && matchesCategory && matchesRating;
    });

   document.getElementById('favorites-matching').textContent = `You have ${filtered.length} favorite(s).`;
    
    favoritesList.innerHTML = '';
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message"> No favorites have been added yet. Add your first one above!</p>';
        return;
    } else if (filtered.length === 0) {  
        favoritesList.innerHTML ='<p class="empty-message"> Nothing matches your search. </p>';
        return;
    }

    filtered.forEach(function(favorite) {
    const index = favorites.indexOf(favorite);
    const stars = '⭐'.repeat(favorite.rating);
    favoritesList.innerHTML += `
        <div class="favorite-card">
        <h3>${favorite.name}</h3>
    <span class="favorite-category">${favorite.category}</span>
    <div class="favorite-rating">${stars} (${favorite.rating}/5)</div>
    <p class="favorite-notes">${favorite.notes}</p>
    <p class="favorite-date">Added: ${favorite.dateAdded}</p>
            <button class="btn-danger" onclick="deleteFavorite(${index})">Delete</button>
        </div>`;
});


}

// The last line in js/app.js
loadFavorites();
displayFavorites();
