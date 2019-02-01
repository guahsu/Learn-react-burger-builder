import React from 'react'

import classes from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'

const layout = props => (
  <>
    <Toolbar />
    <SideDrawer />
    <main className={classes.content}>
      {props.children}
    </main>
  </>
)

export default layout
