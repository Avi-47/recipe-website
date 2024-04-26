const recipeId = new URLSearchParams(window.location.search).get('id');

if (recipeId) {
  fetchRecipeDetails(recipeId);
} else {
  // Handle case where no recipe ID is provided
  console.error('Missing recipe ID');
  document.getElementById('recipe-content').innerHTML = 'Sorry, no recipe ID provided.';
}

function fetchRecipeDetails(mealId) {
  const recipeUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

  fetch(recipeUrl)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      if (!meal) {
        document.getElementById('recipe-content').innerHTML = 'Sorry, recipe not found.';
        return;
      }
      displayRecipe(meal);
    })
    .catch(error => {
      console.error('Error fetching recipe:', error);
      document.getElementById('recipe-content').innerHTML = 'Error fetching recipe.';
    });
}

function displayRecipe(meal) {
  const recipeContent = document.getElementById('recipe-content');
  recipeContent.innerHTML = ''; // Clear previous recipe content

  const recipeImage = document.createElement('img');
  recipeImage.className = 'recipe-image';

  // Add error handling for missing image
  if (meal.strMealThumb) {
    recipeImage.src = meal.strMealThumb;
    recipeImage.alt = `${meal.strMeal} recipe image`;
  } else {
    recipeImage.src = 'placeholder.png'; // Replace with your placeholder image path
    recipeImage.alt = 'No image available';
  }
  recipeContent.appendChild(recipeImage);

  const recipeTitle = document.createElement('h3');
  recipeTitle.textContent = meal.strMeal;
  recipeContent.appendChild(recipeTitle);

  const ingredientsList = document.createElement('ul');
  ingredientsList.classList.add('ingredients');
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal['strIngredient' + i];
    const measure = meal['strMeasure' + i];
    if (ingredient) {
      const ingredientItem = document.createElement('li');
      ingredientItem.textContent = `${measure} ${ingredient}`;
      ingredientsList.appendChild(ingredientItem);
    }
  }
  // Check if there are any ingredients before appending the list
  if (ingredientsList.children.length > 0) {
    recipeContent.appendChild(ingredientsList);
  }

  const instructions = document.createElement('p');
  instructions.classList.add('instructions');
  instructions.textContent = meal.strInstructions;
  recipeContent.appendChild(instructions);
}
