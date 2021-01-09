import React from 'react'
import {render} from '@testing-library/react'

import Button from './Button'

describe('<Button />', () => {

  it('should otherwise match snapshot', ()=> {
    const {container} = render(<Button>Valider</Button>)

    expect(container).toMatchSnapshot()
  })
})
