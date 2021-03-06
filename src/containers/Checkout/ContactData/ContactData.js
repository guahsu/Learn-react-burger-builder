import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from '../../../axios-orders'
import classes from './ContactData.module.css'

import Input from '../../../components/UI/Input/Input'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' }
          ]
        },
        value: 'fastest',
        validation: {},
        valid: true
      }
    },
    formIsValid: false,
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault()
    this.setState({ loading: true })
    const formData = Object.keys(this.state.orderForm)
      .reduce((data, key) => {
        data[key] = this.state.orderForm[key].value
        return data
      }, {})

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: formData
    }

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({ loading: false })
        window.alert('Success to Created Order')
        this.props.history.push('/')
      })
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
      })
  }

  checkValidity (value, rules) {
    let isValid = true
    if (rules.required) {
      isValid = value.trim() !== '' && isValid
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }
    return isValid
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    }
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    }
    updatedFormElement.value = event.target.value
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
    updatedFormElement.touched = true
    updatedOrderForm[inputIdentifier] = updatedFormElement

    const formIsValid = Object.keys(updatedOrderForm).every(key => {
      return updatedOrderForm[key].validation ? updatedOrderForm[key].valid : true
    })

    this.setState({
      orderForm: updatedOrderForm,
      formIsValid
    })
  }

  render () {
    const formElements = Object.keys(this.state.orderForm).map(key => {
      return (
        <Input
          elementType={this.state.orderForm[key].elementType}
          elementConfig={this.state.orderForm[key].elementConfig}
          value={this.state.orderForm[key].elementConfig.value}
          changed={(event) => this.inputChangedHandler(event, key)}
          invalid={!this.state.orderForm[key].valid}
          shouldValidate={this.state.orderForm[key].validation}
          touched={this.state.orderForm[key].touched}
          key={key} />
      )
    })
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements}
        <Button
          buttonType='Success'
          disabled={!this.state.formIsValid} >
          ORDER
        </Button>
      </form>
    )
    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice
  }
}

export default connect(mapStateToProps)(ContactData)
