const searchInput = document.getElementById('food-search'); // Assuming your search input has id="food-search"

// Event listener for both 'keyup' and 'enter' key press
searchInput.addEventListener('keyup', handleSearch);

function handleSearch(event) {
  if (event.key === 'Enter') {
    searchRecipe();
  } else {
    // Code to filter and display suggestions as you type
    const foodItem = searchInput.value.trim();

    if (!foodItem) {
      return; // No need to process if input is empty
    }

    const suggestionUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodItem}`;

    fetch(suggestionUrl)
      .then(response => response.json())
      .then(data => {
        const suggestionList = document.getElementById('suggestions');
        suggestionList.innerHTML = ''; // Clear previous suggestions

        if (!data.meals) {
          suggestionList.innerHTML = 'No such suggestions found 🫣.';
          return;
        }

        const suggestions = data.meals.filter(suggestion =>
          suggestion.strMeal.toLowerCase().startsWith(foodItem.toLowerCase())
        );

        // Enhanced suggestion list with link to recipe page
        suggestions.forEach(suggestion => {
          const suggestionItem = document.createElement('li');
          const suggestionLink = document.createElement('a');
          suggestionLink.href = `real_recipe.html?id=${suggestion.idMeal}`; // Link to recipe page
          suggestionLink.textContent = suggestion.strMeal;

          // Add image preview if available (consider error handling)
          if (suggestion.strMealThumb) {
            const suggestionImage = document.createElement('img');
            suggestionImage.src = suggestion.strMealThumb;
            suggestionImage.alt = suggestion.strMeal;
            suggestionItem.appendChild(suggestionImage);
          }

          suggestionItem.appendChild(suggestionLink);
          suggestionList.appendChild(suggestionItem);
        });
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
        suggestionList.innerHTML = 'Error fetching suggestions.';
      });
  }
}
