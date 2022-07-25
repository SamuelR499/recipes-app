import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import FilterButtonType from '../../components/RecipeCardComponents/FilterButtonType';
import FilterButtonAll from '../../components/RecipeCardComponents/FilterButtonAll';
import RecipeCardImg from '../../components/RecipeCardComponents/RecipeCardImg';
import RecipeCardShareButton,
{ setPopUpInit } from '../../components/RecipeCardComponents/RecipeCardShareButton';
import getFavorites from '../../components/helpers/getFavorites';
import RecipeCardFavoriteButton
from '../../components/RecipeCardComponents/RecipeCardFavoriteButton';
import RecipeCardAttribute
from '../../components/RecipeCardComponents/RecipeCardAttrbiute';
import RecipeCardGoToButton
from '../../components/RecipeCardComponents/RecipeCardGoToButton';
import Header from '../../components/Header';

export default function FavoriteRecipes() {
  const [data, setData] = useState(getFavorites());
  const [popUp, setPopUp] = useState(setPopUpInit());
  const history = useHistory();
  const [filterSelect, setFilterSelect] = useState('all');

  if (getFavorites() <= 0) {
    return (
      <div>
        <Header
          currentPage="Favorite Recipes"
          history={ history }
          isSearchBar={ false }
        />
        <p>No Favorite Recipes...</p>
      </div>
    );
  }

  return (
    <div className="favorite-page">
      <Header
        currentPage="Favorite Recipes"
        history={ history }
        isSearchBar={ false }
      />
      <div className="filter-buttons-list">
        <FilterButtonAll
          setState={ setData }
          target="doneRecipes"
          chosenFilter={ filterSelect }
          setFilter={ setFilterSelect }
        />
        <FilterButtonType
          type="food"
          setState={ setData }
          target="doneRecipes"
          chosenFilter={ filterSelect }
          setFilter={ setFilterSelect }
        />
        <FilterButtonType
          type="drink"
          setState={ setData }
          target="doneRecipes"
          chosenFilter={ filterSelect }
          setFilter={ setFilterSelect }
        />
      </div>
      <div>
        { data.map((item, index) => (
          <div key={ item.id }>
            <RecipeCardImg
              image={ item.image }
              recipe={ item.name }
              index={ index }
              type={ item.type }
              id={ item.id }
            />
            <RecipeCardShareButton
              id={ item.id }
              state={ popUp }
              setState={ setPopUp }
              popUp={ popUp[item.id] || false }
              type={ item.type }
              index={ index }
              page="/favorite-recipes"
            />
            <RecipeCardFavoriteButton
              id={ item.id }
              setState={ setData }
              popUp={ popUp }
              setPopUp={ setPopUp }
              index={ index }
              isFavorite
            />
            <RecipeCardAttribute
              index={ index }
              items={ [item.nationality || item.alcoholicOrNot, item.category] }
            />
            <RecipeCardGoToButton
              index={ index }
              type={ item.type }
              id={ item.id }
              itemName={ item.name }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
