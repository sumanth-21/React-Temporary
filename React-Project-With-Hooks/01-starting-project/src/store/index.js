import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './Cart';
import mealsReducer from './Meals';


const store = configureStore({
  reducer: { cart: cartReducer, meals: mealsReducer },
});

export default store;