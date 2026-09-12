import { fileToBase64 } from '../utils/storage'

interface Props {
  label: string
  currentUrl?: string
  onUpload: (base64: string) => void
}

export default function UploadField({ label, currentUrl, onUpload }: Props) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    onUpload(base64)
  }

  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {currentUrl && (
          <img src={currentUrl} alt={label} style={{ width: 40, height: 40, objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: 4 }} />
        )}
        <input type="file" accept="image/*" onChange={handleChange} style={{ fontSize: '13px' }} />
      </div>
    </div>
  )
}
