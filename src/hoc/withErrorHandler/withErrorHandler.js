import React, { Component } from 'react'

import Modal from '../../components/UI/Modal/Modal'

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state ={
      error: null
    }

    componentWillMount () {
      this.requestInterceptors = axios.interceptors.request.use(req => {
        this.setState({ error: null })
        return req
      })
      this.responseInterceptors = axios.interceptors.response.use(null, err => {
        this.setState({ error: err })
      })
    }

    componentWillUnmount () {
      axios.interceptors.request.eject(this.requestInterceptors)
      axios.interceptors.response.eject(this.requestInterceptors)
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null })
    }

    render () {
      return (
        <>
          <Modal
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler} >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </>
      )
    }
  }
}

export default withErrorHandler
