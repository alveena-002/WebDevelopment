import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CanvasEditor, { CanvasEditorHandle } from './components/CanvasEditor'
import TemplateSelector from './components/TemplateSelector'
import UploadField from './components/UploadField'
import RecordsList from './components/RecordsList'
import { templates, getTemplateById } from './templates/templates'
import { CertificateData, IssuedCertificate } from './types/certificate'
import { getAllRecords, saveRecord, deleteRecord } from './utils/storage'
import { downloadPDF } from './utils/generatePDF'

export default function App() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id)
  const [data, setData] = useState<CertificateData>({
    recipientName: '',
    courseName: '',
    date: '',
    issuerName: '',
    templateId: templates[0].id,
  })
  const [records, setRecords] = useState<IssuedCertificate[]>([])
  const [activeTab, setActiveTab] = useState<'editor' | 'records'>('editor')
  const canvasRef = useRef<CanvasEditorHandle>(null)

  const template = getTemplateById(selectedTemplateId)

  useEffect(() => {
    setRecords(getAllRecords())
  }, [])

  const updateField = (field: keyof CertificateData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = () => {
    if (!canvasRef.current) return
    if (!data.recipientName) {
      alert('Recipient Name zaroori hai')
      return
    }
    const dataUrl = canvasRef.current.exportDataUrl()
    const { width, height } = canvasRef.current.getSize()
    const fileName = `certificate_${data.recipientName.replace(/\s+/g, '_')}.pdf`
    downloadPDF(dataUrl, width, height, fileName)

    const record: IssuedCertificate = {
      id: uuidv4().slice(0, 8).toUpperCase(),
      certificateData: { ...data, templateId: selectedTemplateId },
      templateId: selectedTemplateId,
      templateName: template.name,
      issuedAt: new Date().toISOString(),
    }
    saveRecord(record)
    setRecords(getAllRecords())
  }

  const handleDelete = (id: string) => {
    deleteRecord(id)
    setRecords(getAllRecords())
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ background: '#111827', color: '#fff', padding: '16px 24px' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🎓 Certificate Maker</h1>
      </header>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', gap: '20px' }}>
        {(['editor', 'records'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 4px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === tab ? '#2563eb' : '#374151',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '14px',
              textTransform: 'capitalize',
            }}
          >
            {tab === 'editor' ? 'Create Certificate' : 'Issued Records'}
          </button>
        ))}
      </nav>

      <main style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
        {activeTab === 'editor' ? (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {/* Left: Form panel */}
            <div style={{ width: '320px', background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ marginTop: 0 }}>1. Choose Style</h3>
              <TemplateSelector templates={templates} selectedId={selectedTemplateId} onSelect={setSelectedTemplateId} />

              <h3>2. Certificate Details</h3>
              <input placeholder="Recipient Name" value={data.recipientName} onChange={e => updateField('recipientName', e.target.value)} style={inputStyle} />
              <input placeholder="Course / Reason" value={data.courseName} onChange={e => updateField('courseName', e.target.value)} style={inputStyle} />
              <input placeholder="Date" type="date" value={data.date} onChange={e => updateField('date', e.target.value)} style={inputStyle} />
              <input placeholder="Issuer Name" value={data.issuerName} onChange={e => updateField('issuerName', e.target.value)} style={inputStyle} />

              <h3>3. Upload Assets</h3>
              <UploadField label="Logo" currentUrl={data.logoUrl} onUpload={v => updateField('logoUrl', v)} />
              <UploadField label="Signature" currentUrl={data.signatureUrl} onUpload={v => updateField('signatureUrl', v)} />
              <UploadField label="Icon" currentUrl={data.iconUrl} onUpload={v => updateField('iconUrl', v)} />

              <button onClick={handleGenerate} style={generateBtnStyle}>
                Generate & Save Certificate
              </button>
            </div>

            {/* Right: Canvas preview */}
            <div style={{ flex: 1, minWidth: '620px', background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'auto' }}>
              <div style={{ transform: 'scale(0.52)', transformOrigin: 'top left', width: template.width * 0.52, height: template.height * 0.52 }}>
                <CanvasEditor ref={canvasRef} template={template} data={data} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0 }}>Issued Certificates</h3>
            <RecordsList records={records} onDelete={handleDelete} />
          </div>
        )}
      </main>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px',
  marginBottom: '10px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
}

const generateBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: '10px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '14px',
}
