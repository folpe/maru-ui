import React from 'react'
import { bool, node, oneOf } from 'prop-types'
import classnames from 'classnames'

import './button.scss'

/**
 * Represents a button.
 * @component
 * @param {color} color - The color of the button.
 * @param {variant} variant - The variant of the button.
 * @param {size} size - The size of the button ['small', 'medium', 'large'].
 * @param {full} full - [Boolean] If true the button is 100% width.
 */
export const Button = (
  {
    children,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    full = false,
    disabled = false,
  },
  props
) => {
  return (
    <button
      {...props}
      className={classnames(variant, color, size, { full })}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: node.isRequired,
  variant: oneOf(['contained', 'outlined', 'text', 'naked']),
  color: oneOf(['primary', 'secondary']),
  size: oneOf(['small', 'medium', 'large']),
  full: bool,
  disabled: bool,
}
