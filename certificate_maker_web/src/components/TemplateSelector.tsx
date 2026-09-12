import { CertificateTemplate } from '../types/certificate'

interface Props {
  templates: CertificateTemplate[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function TemplateSelector({ templates, selectedId, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {templates.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: selectedId === t.id ? `2px solid ${t.borderColor}` : '2px solid #e5e7eb',
            background: selectedId === t.id ? '#f9fafb' : '#fff',
            cursor: 'pointer',
            fontWeight: selectedId === t.id ? 'bold' : 'normal',
            fontSize: '14px',
          }}
        >
          {t.name}
        </button>
      ))}
    </div>
  )
}
