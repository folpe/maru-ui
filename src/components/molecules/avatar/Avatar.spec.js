import React from 'react'
import { render } from '@testing-library/react'

import Avatar from './Avatar'

describe('<Avatar />', () => {
  it('should otherwise match snapshot', () => {
    const { container } = render(
      <Avatar size='small' name='Shiba' lastname='Maru' />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display an image if props exist', () => {})
  it('should display initials if no image passed', () => {})
})
