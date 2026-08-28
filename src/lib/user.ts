export type User = {
  name: string
  role: string
  branch: string
}

// Mock de usuario logueado. Reemplazar por la sesion real mas adelante.
export const currentUser: User = {
  name: 'Martina Gomez',
  role: 'Operaciones',
  branch: '06 RESISTENCIA',
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
