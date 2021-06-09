export const getInitials = ({ name, lastname }) => {
  if (!name) return
  if (!lastname) {
    return name.charAt(0).toUpperCase()
  }
  return name.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase()
}
