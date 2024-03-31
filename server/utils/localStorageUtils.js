export const saveLocalStorage = (key, item) => {
  // aquí haría la encriptacion del token
  localStorage.setItem(key, item)
  return true
}

export const getLocalStorage = (key) => {
  const result = localStorage.getItem(key)
  // aquí haría la desencriptación del token
  return result
}

export const deleteLocalStorage = (key) => {
  localStorage.removeItem(key)
  return true
}