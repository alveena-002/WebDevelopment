import { IssuedCertificate } from '../types/certificate'

const STORAGE_KEY = 'certificate_maker_records'

export function getAllRecords(): IssuedCertificate[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as IssuedCertificate[]
  } catch {
    return []
  }
}

export function saveRecord(record: IssuedCertificate): void {
  const records = getAllRecords()
  records.unshift(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function deleteRecord(id: string): void {
  const records = getAllRecords().filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

// File ko base64 string me convert karta hai (upload ke liye - local storage friendly)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
