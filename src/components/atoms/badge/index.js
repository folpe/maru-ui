import React from 'react'
import { node, oneOf, string } from 'prop-types'

import classnames from 'classnames'
import './badge.scss'

export const Badge = ({
  children,
  form = 'circle',
  color = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <div className={classnames('badge', form, color, size, props.className)}>
      {children}
    </div>
  )
}

Badge.propTypes = {
  children: node,
  form: oneOf(['rounded', 'circle']),
  color: oneOf(['primary', 'secondary']),
  size: oneOf(['xsmall', 'small', 'medium', 'large']),
  className: string,
}
