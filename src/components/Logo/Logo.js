import React from 'react'

import classes from './Logo.module.css'
import burgerLogo from '../../assets/images/burger-logo.png'

const logo = props => (
  <div className={props.customClass}>
    <div className={classes.Logo}>
      <img src={burgerLogo} alt='Burger Logo' />
      {props.customStyle}
    </div>
  </div>
)

export default logo
