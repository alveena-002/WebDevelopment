import { IssuedCertificate } from '../types/certificate'

interface Props {
  records: IssuedCertificate[]
  onDelete: (id: string) => void
}

export default function RecordsList({ records, onDelete }: Props) {
  if (records.length === 0) {
    return <p style={{ color: '#6b7280', fontSize: '14px' }}>Abhi tak koi certificate issue nahi hua.</p>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
          <th style={{ padding: '8px' }}>Recipient</th>
          <th style={{ padding: '8px' }}>Template</th>
          <th style={{ padding: '8px' }}>Issued On</th>
          <th style={{ padding: '8px' }}>Certificate ID</th>
          <th style={{ padding: '8px' }}></th>
        </tr>
      </thead>
      <tbody>
        {records.map(r => (
          <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '8px' }}>{r.certificateData.recipientName}</td>
            <td style={{ padding: '8px' }}>{r.templateName}</td>
            <td style={{ padding: '8px' }}>{new Date(r.issuedAt).toLocaleString()}</td>
            <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '12px' }}>{r.id}</td>
            <td style={{ padding: '8px' }}>
              <button onClick={() => onDelete(r.id)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
