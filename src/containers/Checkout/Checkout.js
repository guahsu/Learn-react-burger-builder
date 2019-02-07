import React, { Component } from 'react'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

class Checkout extends Component {
  state = {
    ingredients: {
      salad: 0,
      meat: 0,
      cheese: 0,
      bacon: 0
    }
  }

  componentDidMount () {
    const query = new URLSearchParams(this.props.location.search)
    const ingredients = {}
    for (let param of query) {
      ingredients[param[0]] = parseInt(param[1], 10)
    }
    this.setState({ ingredients: ingredients })
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack()
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data')
  }

  render () {
    return (
      <CheckoutSummary
        ingredients={this.state.ingredients}
        checkoutCancelled={this.checkoutCancelledHandler}
        checkoutContinued={this.checkoutContinuedHandler} />
    )
  }
}

export default Checkout
