import React from 'react'
import { node } from 'prop-types'

const Button = ({ children }, props) => {
  return <button {...props}>{children}</button>
}

Button.propTypes = {
  children: node.isRequired,
}

export default Button
