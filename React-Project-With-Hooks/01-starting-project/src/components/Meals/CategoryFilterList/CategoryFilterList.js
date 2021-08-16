import React from 'react';

import classes from './CategoryFilterList.module.css';
import CategoryFilter from './CategoryFilter/CategoryFilter';

const categoryFilterList = (props) => (
    <div className={classes.productFilterContainer}>
        <p><strong>Filter By Category:</strong></p>
        {props.categoryList.map( category => (
            <CategoryFilter
                key = {category}
                category={category}
                checked= {props.checked}
                />
        ) )}
    </div>
);

export default categoryFilterList;