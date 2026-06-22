export const LIBRARY_TABLE = 'biblioteca'
export const LIBRARY_BUCKET = 'biblioteca-pdfs'

export const LIBRARY_CATEGORIES = ['Teología', 'Devocional', 'Historia', 'Infantil', 'Otro']

export function formatLibraryDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('es-AR').format(new Date(value))
}

export function getStorageFileName(file, folder) {
  const cleanName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')

  return `${folder}/${Date.now()}_${cleanName}`
}

export function sanitizeSupabaseOrQuery(query) {
  return query.replace(/[%,]/g, '').trim()
}
