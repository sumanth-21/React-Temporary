import React from 'react';

import classes from './CategoryFilter.module.css';

const categoryFilter = (props) => (
    <div className={classes.productFilter}>
        <div>
            <input type="checkbox" value={props.category} onChange= {props.checked.bind(this)} />
            <label>{props.category}</label>
        </div>
    </div>
);

export default categoryFilter;