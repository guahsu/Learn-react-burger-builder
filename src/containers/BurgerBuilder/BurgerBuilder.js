import React, { Component } from 'react'

import Burger from '../../components/Burger/Burger'

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
    }
  }

  render () {
    return (
      <>
        <Burger ingredients={this.state.ingredients} />
        <div>Build Controls</div>
      </>
    )
  }
}

export default BurgerBuilder
