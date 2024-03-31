export const textSensitive = (propiedad, filter) =>{
    return propiedad
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(
            filter
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        )
  }