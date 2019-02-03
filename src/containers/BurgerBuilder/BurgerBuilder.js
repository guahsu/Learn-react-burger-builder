import React, { Component } from 'react'
import axios from '../../axios-orders'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  // Old way to init props
  // constructor (props) {
  //   super(props)
  //   this.state = {...}
  // }

  // modern way
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchaseable: false,
    purchasing: false
  }

  updatePurchaseState (ingredients) {
    // console.log(this.setState)
    const sum = Object.values(ingredients).reduce((sum, item) => {
      return sum + item
    }, 0)
    this.setState({ purchaseable: sum > 0 })
  }

  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type]
    const updateCount = oldCount + 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updateCount
    const priceAddition = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totalPrice
    const newPrice = oldPrice + priceAddition
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = type => {
    const oldCount = this.state.ingredients[type]
    if (oldCount > 0) {
      const updateCount = oldCount - 1
      const updatedIngredients = {
        ...this.state.ingredients
      }
      updatedIngredients[type] = updateCount
      const priceDeduction = INGREDIENT_PRICES[type]
      const oldPrice = this.state.totalPrice
      const newPrice = oldPrice - priceDeduction
      this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
      this.updatePurchaseState(updatedIngredients)
    }
  }

  // FAIL, "this.setState" not in BuildControls (which the component I passed this method)
  // purchaseHander () {
  //   this.setState({ purchasing: true })
  // }

  // Worked ! modify this method to arrow function
  purchaseHander = () => {
    this.setState({ purchasing: true })
  }

  purchaseCancelHander = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    // window.alert('You Continue !')
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Gua Hsu',
        email: 'test@test.com',
        address: {
          street: 'Test street 1',
          zipCode: '12345',
          country: 'Taiwan'
        }
      },
      deliveryMethod: 'fastest'
    }

    axios.post('/orders.json', order)
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err))
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    return (
      <>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHander}>
          <OrderSummary
            price={this.state.totalPrice}
            ingredients={this.state.ingredients}
            purchaseCancel={this.purchaseCancelHander}
            purchaseContinue={this.purchaseContinueHandler} />
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHander}
          disabled={disabledInfo} />
      </>
    )
  }
}

export default BurgerBuilder
