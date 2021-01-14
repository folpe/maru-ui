import React from 'react'
import { node } from 'prop-types'

import './button.css'

const Button = ({ children }, props) => {
  return (
    <button {...props} className='buttonDeLaMort'>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: node.isRequired,
}

export default Button
