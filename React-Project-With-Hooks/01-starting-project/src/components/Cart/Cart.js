import { useSelector, useDispatch } from 'react-redux';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import { cartActions } from '../../store/Cart';

const Cart = (props) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

  const totalAmount = `$${cartTotalAmount.toFixed(2)}`;
  const hasItems = cartItems.length > 0;

  const cartItemRemoveHandler = (id) => {
    dispatch(cartActions.removeItem(id));
  };

  const cartItemAddHandler = (item) => {
    dispatch(cartActions.addItem(item));
  };

  const cartItemList = (
    <ul className={classes['cart-items']}>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {cartItemList}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      <div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onClose}>
          Close
        </button>
        {hasItems && <button className={classes.button}>Order</button>}
      </div>
    </Modal>
  );
};

export default Cart;
