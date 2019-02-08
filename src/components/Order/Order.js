import React from 'react'
import classes from './Order.module.css'

const order = props => {
  const ingredients = Object.keys(props.ingredients)
    .map(key => {
      return {
        name: key,
        amount: props.ingredients[key]
      }
    })
    .map(ingredient => (
      <span
        className={classes.Ingredient}
        key={ingredient.name} >
        {ingredient.name}({ingredient.amount})
      </span>
    ))
  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredients}</p>
      <p>Price: <strong>{parseInt(props.price, 10).toFixed(2)}</strong></p>
    </div>
  )
}

export default order
