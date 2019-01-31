import React from 'react'

import Button from '../../UI/Button/Button'

const orderSummary = props => {
  const ingredientSummary = Object.keys(props.ingredients)
    .map(igKey => (
      <li
        style={{ textTransform: 'capitalize' }}
        key={igKey}>
        <span>{igKey}</span>: {props.ingredients[igKey]}
      </li>
    ))

  return (
    <>
      <h3>Your Order</h3>
      <p>A delicious burger with tje following ingredients</p>
      <ul>
        {ingredientSummary}
      </ul>
      <p>Continue to Checkout ?</p>
      <Button
        buttonType='Danger'
        clicked={props.purchaseCancel} >
        CANCEL
      </Button>
      <Button
        buttonType='Success'
        clicked={props.purchaseContinue} >
        CONTINUE
      </Button>
    </>
  )
}

export default orderSummary
