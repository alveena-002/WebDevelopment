export interface TemplateElement {
  id: string
  type: 'text' | 'image'
  role: 'recipientName' | 'courseName' | 'date' | 'issuerName' | 'logo' | 'signature'
  x: number
  y: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  letterSpacing?: number
  width?: number
  height?: number
}

// Decorative divider line jo recipient name ke neeche aata hai
export interface DividerStyle {
  x: number
  y: number
  width: number
  color: string
}

// Gold/colored seal-medallion (achievement badge) design
export interface SealStyle {
  x: number
  y: number
  radius: number
  ringColor: string
  innerColor: string
  starColor: string
  ribbonColor: string
}

export interface CertificateTemplate {
  id: string
  name: string
  backgroundColor: string
  backgroundAccent: string // subtle watermark tint color
  borderColor: string
  accentColor: string
  headingLabel: string // small kicker text e.g. "CERTIFICATE OF"
  width: number
  height: number
  elements: TemplateElement[]
  divider?: DividerStyle
  seal?: SealStyle
}

export interface CertificateData {
  recipientName: string
  courseName: string
  date: string
  issuerName: string
  templateId: string
  logoUrl?: string
  signatureUrl?: string
  iconUrl?: string
}

export interface IssuedCertificate {
  id: string
  certificateData: CertificateData
  templateId: string
  templateName: string
  issuedAt: string
  pdfDataUrl?: string
}
