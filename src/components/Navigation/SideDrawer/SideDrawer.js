import React from 'react'

import classes from './SideDrawer.module.css'
import Logo from '../../Logo/Logo'
import Backdrop from '../../UI/Backdrop/Backdrop'
import NavigationItems from '../NavigationItems/NavigationItems'

const sideDrawer = props => {
  let attachedClasses = [classes.SideDrawer, classes.Close]
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open]
  }

  return (
    <>
      <Backdrop
        show={props.open}
        clicked={props.closed} />
      <div className={attachedClasses.join(' ')}>
        <Logo customClass={classes.Logo} />
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </>
  )
}

export default sideDrawer
