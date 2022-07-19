import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types';
import mealAPI from '../../services/mealAPI';
import drinkAPI from '../../services/drinkAPI';
import Carousel from './components/Carousel';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import shareIcon from '../../images/shareIcon.svg';
const copy = require('clipboard-copy');

export default function RecipeDetails(props) {
  const [recommendation, setRecommendation] = useState([]);
  const [recipeState, setRecipeState] = useState('Start Recipe');
  const [heartImg, setHeartImg] = useState(whiteHeartIcon);
  const [isFinished, setIsFinished] = useState(true);
  const [foodObject, setFoodObject] = useState({
    DrinkThumb: '',
    Drink: '',
    Alcoholic: '',
    ingredients: [],
    Instructions: '',
  });
  const { match: { params: { id } } } = props;

  const { location: { pathname } } = useHistory();
  const path = pathname.split('/').filter((item) => item);
  const funcMap = path[0] === 'foods' ? mealAPI : drinkAPI;

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));

    if (favoriteRecipes) {
      const result = favoriteRecipes.find((recipe) => recipe.id === id);
      if (result) {
        setHeartImg(blackHeartIcon);
      }
    }
  }, [])

  useEffect(() => {
    const firstCall = async () => {
      const result = await funcMap.getById(id);
      setFoodObject(result);
    };
    firstCall();
  }, []);

  useEffect(() => {
    const recommend = async () => {
      const result = await funcMap.name('');
      // console.log(result);
      setRecommendation(result);
      // console.log(recommendation);
    };
    recommend();
  }, []);

  // useEffect(() => {
  //   const doneRecipes = localStorage.getItem('doneRecipes');

  //   const inProgressRecipes = localStorage.getItem('inProgressRecipes');

  //   const inProgress = foodObject.some((recipe) => food.Drink === inProgressRecipes || food.Meal === inProgressRecipes);

  //   const result = foodObject.some((food) => food.Drink === doneRecipes || food.Meal === doneRecipes);

  //   setIsFinished(!result);
  //   if (inProgress) setRecipeState('Continue Recipe'); else setRecipeState('Start Recipe');
  // }, []);


  function onFavoriteBtnClick() { 
    const image = foodObject.MealThumb || foodObject.DrinkThumb;
    const name = foodObject.Meal || foodObject.Drink;
    const alcoholicOrNot = foodObject.Alcoholic;
    const category = foodObject.Category;
    const nationality = foodObject.Area;
    const type = foodObject.Tags;

    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));

    if (favoriteRecipes) {
      const favoriteRecipesObj = [ ...favoriteRecipes, { 
        id, type, nationality, category, alcoholicOrNot, name, image 
      }]
      
      if (heartImg === whiteHeartIcon) {
        localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipesObj));
      }
    
      if (heartImg === blackHeartIcon) {
        const newFavoriteRecipes = favoriteRecipesObj.filter((recipe) => recipe.id !== id);
        localStorage.setItem('favoriteRecipes', JSON.stringify(newFavoriteRecipes));
      }
    } else {

      const favoriteRecipesObj = [{ 
        id, type, nationality, category, alcoholicOrNot, name, image 
      }]

      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipesObj));
    }
    
    heartImg === whiteHeartIcon ? setHeartImg(blackHeartIcon) : setHeartImg(whiteHeartIcon);    
  };

  function onShareBtnClick() {
    copy(`${pathname}`);
    window.alert('Link copied!');
  }

  return (
    <div 
      style={ {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      } }
    >
      <div>
        <img
          width="250px"
          src={ foodObject.DrinkThumb || foodObject.MealThumb }
          alt={ foodObject.Drink || foodObject.Meal }
          data-testid="recipe-photo"
        />
        <h3
          data-testid="recipe-title"
        >
          { foodObject.Drink || foodObject.Meal }
        </h3>
        <button
          type="button"
          data-testid="favorite-btn"
          style = {{
            border: 'none',
            background: 'transparent',
          }}
          onClick= { onFavoriteBtnClick }
        >
          <img src={ heartImg } alt="favorite image" width="17px" />
        </button>
        <button
          type="button"
          data-testid="share-btn"
          style = {{
            border: 'none',
            background: 'transparent',
          }}
          onClick= { onShareBtnClick }
        >
          <img src={ shareIcon } alt="share image" width="17px" />
        </button>
        <p data-testid="recipe-category">{ foodObject.Alcoholic || foodObject.Category }</p>
        <ul>
          {
            foodObject.ingredients.map((item, index) => (
              <li
                key={ index }
                data-testid={ `${index}-ingredient-name-and-measure` }
              >
                { ` ${item.measure} of ${item.ingredient} ` }
              </li>
            ))
          }
        </ul>
        <p data-testid="instructions">{ foodObject.Instructions }</p>
        {
          path[0] === 'foods' && <iframe width="420" height="315" data-testid="video"
            src={ foodObject.Youtube }>
         </iframe>
        }
      </div>
      <Carousel recommendation={ recommendation } />
      <div>
        {
          isFinished && (
            <button
              type="button"
              data-testid="start-recipe-btn"
            >
              { recipeState }
            </button>)
        }
      </div>
    </div>
  );
}

RecipeDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};