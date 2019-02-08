import React, { Component } from 'react'
import axios from '../../axios-orders'

import Order from '../../components/Order/Order'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

class Orders extends Component {
  state = {
    orders: [],
    loading: true
  }

  componentDidMount () {
    axios.get('/orders.json')
      .then(res => {
        const fetchOrders = Object.keys(res.data).map(key => {
          return { id: key, ...res.data[key] }
        })
        console.log(fetchOrders)
        this.setState({
          loading: false,
          orders: fetchOrders
        })
      })
      .catch(_ =>
        this.setState({ loading: false })
      )
  }

  render () {
    const orders = this.state.orders.map(order => (
      <Order
        key={order.id}
        ingredients={order.ingredients}
        price={order.price} />
    ))
    return (
      <div>
        {orders}
      </div>
    )
  }
}

export default withErrorHandler(Orders, axios)
