import { useState, useEffect } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import Spinner from '../UI/Spinner/Spinner';
import CategoryFilterList from '../Meals/CategoryFilterList/CategoryFilterList';



const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch(
        'https://react-project-with-hooks-default-rtdb.firebaseio.com/meals.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await response.json();

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push(responseData[key]);
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const categorylist = [];
  meals.forEach( product => {
    if(!categorylist.includes(product.category)) {
      categorylist.push(product.category);
    }
  }
  );

  
  const checkBoxHandler = (event) => {
      let category = event.target.value;
      if(event.target.checked) {
          if(!filter.includes(category)) {
              setFilter( arr => [...arr, category])
          }
      }
      else {
          if(filter.includes(category)) {
              setFilter( filter.filter(item => item !== category))
          }
      }
  };

  const mealsList = meals.map( meal => {
    if(filter.length === 0 || filter.includes(meal.category)) {
      return (    
      <MealItem
        key={meal.id}
        id={meal.id}
        name={meal.name}
        category={meal.category}
        vendor={meal.vendor}
        price={meal.price}
        available={meal.available}
      />);
    }
  }
  );

  return (
    <section className={classes.meals}>
      <Card class={classes.mealsList}>
        <ul>{mealsList}</ul>
      </Card>
      <Card class={classes.mealsFilter} >
        <CategoryFilterList
            categoryList ={categorylist}
            checked= {checkBoxHandler}
            />
      </Card>
    </section>
  );
};

export default AvailableMeals;
