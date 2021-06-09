import React from 'react'
import { render } from '@testing-library/react'
import Badge from './Badge'

describe('<Badge/>', () => {
  it('should otherwise match snapshot', () => {
    const { container } = render(<Badge />)
    expect(container).toMatchSnapshot()
  })
})
