import classes from './Card.module.css';

const Card = props => {
  const classList = `${classes.card} ${props.class ? props.class : ''}`;
  
  return <div className={classList}>{props.children}</div>
};

export default Card;