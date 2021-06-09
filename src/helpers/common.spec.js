import { getInitials } from './common'

describe('Common helpers', () => {
  describe('getInitials', () => {
    it('should display one character if only 1 name passed', () => {
      const result = getInitials({ name: 'Shiba' })
      expect(result).toHaveLength(1)
    })

    it('should display two characters if firstname and lastname exist', () => {
      const result = getInitials({ name: 'Shiba', lastname: 'Maru' })
      expect(result).toHaveLength(2)
    })

    it('should display two characters of the first names even if more than 2 names exist', () => {
      const result = getInitials({
        name: 'Shiba Yogi',
        lastname: 'Maru De La Vega',
      })
      expect(result).toHaveLength(2)
    })
  })
})
