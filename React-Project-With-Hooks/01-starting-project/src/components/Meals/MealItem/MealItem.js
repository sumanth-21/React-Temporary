import { useDispatch } from 'react-redux';

import MealItemForm from './MealItemForm';
import classes from './MealItem.module.css';
import { cartActions } from '../../../store/Cart';

const MealItem = (props) => {
  const dispatch = useDispatch();

  const price = `$${props.price.toFixed(2)}`;

  const addToCartHandler = amount => {
    dispatch(cartActions.addItem({
      id: props.id,
      name: props.name,
      amount: amount,
      price: props.price
    })
    );
  };

  return (
    <li className={classes.meal}>
      <div>
        <h3>{props.name}</h3>
        <div className={classes.category}><strong>Category: </strong>{props.category}</div>
        <div className={classes.vendor}><strong>Vendor: </strong>{props.vendor}</div>
        <div className={classes.price}>{price}</div>
      </div>
      <div>
        <MealItemForm 
          onAddToCart={addToCartHandler}
          available={props.available} />
      </div>
      {!props.available &&
        <div className={classes.mealStock}>
          <p>Out Of Stock :( </p>
        </div>
      }
      
    </li>
  );
};

export default MealItem;
