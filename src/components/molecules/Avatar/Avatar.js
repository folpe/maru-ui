import React from 'react'

import { node, oneOf, string } from 'prop-types'

import './avatar.scss'
import Badge from '../../atoms/Badge'
import { getInitials } from '../../../helpers/common'

/**
 * Represents an avatar.
 * @component
 * @param {image} image - The image of avatar .
 * @param {name} name - The name of the user 'Firstname' || 'Pseudo'.
 * @param {lastname} lastname - The lastname of the user 'Lastname'.
 * @param {size} size - The size of avatar ['small', 'medium', 'large']
 * @param {form} form - The form of avatar ['rounded', 'circle'].
 * @param {color} color - The color of avatar ['primary', 'secondary'].
 */
const Avatar = ({ image, name, lastname, size, form, color, ...props }) => {
  return (
    <Badge className='avatar' size={size} color={color} form={form}>
      {image || <span>{getInitials({ name, lastname })}</span>}
    </Badge>
  )
}

Avatar.propTypes = {
  size: oneOf(['small', 'medium', 'large']),
  name: string,
  lastname: string,
  form: oneOf(['rounded', 'circle']),
  color: oneOf(['primary', 'secondary']),
  image: node,
}

export default Avatar
