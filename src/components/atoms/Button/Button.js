import React from 'react'
import { bool, node, oneOf } from 'prop-types'
import classnames from 'classnames'

import './button.css'

const Button = (
  {
    children,
    variant = 'text',
    color = 'primary',
    size = 'small',
    full = false,
  },
  props
) => {
  return (
    <button {...props} className={classnames(variant, color, size, { full })}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: node.isRequired,
  variant: oneOf(['contained', 'outlined', 'text']),
  color: oneOf(['primary', 'secondary']),
  size: oneOf(['small', 'medium', 'large']),
  full: bool,
}

export default Button
