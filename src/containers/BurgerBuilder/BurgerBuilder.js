import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from '../../axios-orders'
import * as actionTypes from '../../store/actions'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

class BurgerBuilder extends Component {
  // Old way to init props
  // constructor (props) {
  //   super(props)
  //   this.state = {...}
  // }

  // modern way
  state = {
    purchaseable: false,
    purchasing: false,
    error: false
  }

  componentDidMount () {
    // axios.get('https://react-my-burger-1cdaf.firebaseio.com/ingredients.json')
    //   .then(res => {
    //     this.setState({ ingredients: res.data })
    //   })
    //   .catch(() => {
    //     this.setState({ error: true })
    //   })
  }

  updatePurchaseState (ingredients) {
    // console.log(this.setState)
    const sum = Object.values(ingredients).reduce((sum, item) => {
      return sum + item
    }, 0)
    this.setState({ purchaseable: sum > 0 })
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
    const queryString = '?' + Object.keys(this.props.ingredients)
      .map(key => `${encodeURIComponent(key)}=${this.props.ingredients[key]}`)
      .join('&')
    this.props.history.push({
      pathname: '/checkout',
      search: queryString + `&price=${this.props.totalPrice}`
    })
    // window.alert('You Continue !')
  }

  render () {
    const disabledInfo = {
      ...this.props.ingredients
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null

    let burger = this.state.error
      ? <p>Ingredients can't be loaded !</p>
      : <Spinner />
    if (this.props.ingredients) {
      burger = <>
        <Burger ingredients={this.props.ingredients} />
        <BuildControls
          price={this.props.totalPrice}
          ingredientAdded={this.props.onIngredientAdded}
          ingredientRemoved={this.props.onIngredientRemoved}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHander}
          disabled={disabledInfo} />
      </>

      orderSummary = <OrderSummary
        price={this.props.totalPrice}
        ingredients={this.props.ingredients}
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

const mapStateToProps = state => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingredientName) => dispatch({
      type: actionTypes.ADD_INGREDIENTS,
      ingredientName }),
    onIngredientRemoved: (ingredientName) => dispatch({
      type: actionTypes.REMOVE_INGREDIENTS,
      ingredientName })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))
