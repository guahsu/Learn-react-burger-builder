import React, { Component } from 'react'
import axios from '../../axios-orders'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
  loading: false
}

class BurgerBuilder extends Component {
  // Old way to init props
  // constructor (props) {
  //   super(props)
  //   this.state = {...}
  // }

  // modern way
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    error: false
  }

  componentDidMount () {
    axios.get('https://react-my-burger-1cdaf.firebaseio.com/ingredients.json')
      .then(res => {
        this.setState({ ingredients: res.data })
      })
      .catch(() => {
        this.setState({ error: true })
      })
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
    const queryString = '?' + Object.keys(this.state.ingredients)
      .map(key => `${encodeURIComponent(key)}=${this.state.ingredients[key]}`)
      .join('&')
    this.props.history.push({
      pathname: '/checkout',
      search: queryString
    })
    // window.alert('You Continue !')
    // this.setState({ loading: true })
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Gua Hsu',
    //     email: 'test@test.com',
    //     address: {
    //       street: 'Test street 1',
    //       zipCode: '12345',
    //       country: 'Taiwan'
    //     }
    //   },
    //   deliveryMethod: 'fastest'
    // }

    // axios.post('/orders.json', order)
    //   .then(res => {
    //     // console.log(res)
    //     this.setState({ loading: false, purchasing: false })
    //   })
    //   .catch(err => {
    //     this.setState({ loading: false, purchasing: false })
    //     console.log(err)
    //   })
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null

    let burger = this.state.error
      ? <p>Ingredients can't be loaded !</p>
      : <Spinner />
    if (this.state.ingredients) {
      burger = <>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHander}
          disabled={disabledInfo} />
      </>

      orderSummary = <OrderSummary
        price={this.state.totalPrice}
        ingredients={this.state.ingredients}
        purchaseCancel={this.purchaseCancelHander}
        purchaseContinue={this.purchaseContinueHandler} />
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHander}>
          {orderSummary}
        </Modal>
        {burger}
      </>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios)
