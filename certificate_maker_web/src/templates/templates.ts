import { CertificateTemplate } from '../types/certificate'

const W = 1100
const H = 780

export const templates: CertificateTemplate[] = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    backgroundColor: '#fffdf7',
    backgroundAccent: '#c9a227',
    borderColor: '#b8912b',
    accentColor: '#b8912b',
    headingLabel: 'CERTIFICATE OF ACHIEVEMENT',
    width: W,
    height: H,
    elements: [
      { id: 'logo', type: 'image', role: 'logo', x: W / 2, y: 100, width: 82, height: 82 },
      { id: 'recipient', type: 'text', role: 'recipientName', x: W / 2, y: 345, fontSize: 62, fontFamily: 'Great Vibes', fontWeight: 'normal', color: '#2b2b2b', textAlign: 'center', width: 820 },
      { id: 'course', type: 'text', role: 'courseName', x: W / 2, y: 500, fontSize: 21, fontFamily: 'Cormorant Garamond', fontWeight: '600', color: '#333', textAlign: 'center', width: 640 },
      { id: 'date', type: 'text', role: 'date', x: 220, y: 655, fontSize: 15, fontFamily: 'Montserrat', fontWeight: '500', color: '#444', textAlign: 'center', width: 200 },
      { id: 'signature', type: 'image', role: 'signature', x: 875, y: 600, width: 155, height: 55 },
      { id: 'issuer', type: 'text', role: 'issuerName', x: 875, y: 655, fontSize: 14, fontFamily: 'Montserrat', fontWeight: '600', color: '#333', textAlign: 'center', width: 220 },
    ],
    divider: { x: W / 2, y: 420, width: 250, color: '#b8912b' },
    seal: { x: W / 2, y: 645, radius: 40, ringColor: '#b8912b', innerColor: '#fff8e7', starColor: '#b8912b', ribbonColor: '#7c2d3e' },
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    backgroundColor: '#ffffff',
    backgroundAccent: '#2563eb',
    borderColor: '#1d4ed8',
    accentColor: '#2563eb',
    headingLabel: 'CERTIFICATE OF COMPLETION',
    width: W,
    height: H,
    elements: [
      { id: 'logo', type: 'image', role: 'logo', x: W / 2, y: 95, width: 72, height: 72 },
      { id: 'recipient', type: 'text', role: 'recipientName', x: W / 2, y: 345, fontSize: 52, fontFamily: 'Playfair Display', fontWeight: '700', color: '#0f172a', textAlign: 'center', width: 850 },
      { id: 'course', type: 'text', role: 'courseName', x: W / 2, y: 500, fontSize: 19, fontFamily: 'Montserrat', fontWeight: '500', color: '#334155', textAlign: 'center', width: 640 },
      { id: 'date', type: 'text', role: 'date', x: 220, y: 655, fontSize: 14, fontFamily: 'Montserrat', fontWeight: '500', color: '#475569', textAlign: 'center', width: 200 },
      { id: 'signature', type: 'image', role: 'signature', x: 875, y: 600, width: 145, height: 52 },
      { id: 'issuer', type: 'text', role: 'issuerName', x: 875, y: 655, fontSize: 13, fontFamily: 'Montserrat', fontWeight: '600', color: '#334155', textAlign: 'center', width: 220 },
    ],
    divider: { x: W / 2, y: 420, width: 210, color: '#2563eb' },
    seal: { x: W / 2, y: 645, radius: 40, ringColor: '#2563eb', innerColor: '#eef4ff', starColor: '#2563eb', ribbonColor: '#0f172a' },
  },
  {
    id: 'elegant-ribbon',
    name: 'Elegant Ribbon',
    backgroundColor: '#fbf6f2',
    backgroundAccent: '#7c2d3e',
    borderColor: '#7c2d3e',
    accentColor: '#a8455c',
    headingLabel: 'CERTIFICATE OF EXCELLENCE',
    width: W,
    height: H,
    elements: [
      { id: 'logo', type: 'image', role: 'logo', x: W / 2, y: 100, width: 78, height: 78 },
      { id: 'recipient', type: 'text', role: 'recipientName', x: W / 2, y: 345, fontSize: 54, fontFamily: 'Playfair Display', fontWeight: '600', fontStyle: 'italic', color: '#2b2b2b', textAlign: 'center', width: 850 },
      { id: 'course', type: 'text', role: 'courseName', x: W / 2, y: 500, fontSize: 20, fontFamily: 'Cormorant Garamond', fontWeight: '600', color: '#4b3b3b', textAlign: 'center', width: 640 },
      { id: 'date', type: 'text', role: 'date', x: 220, y: 655, fontSize: 15, fontFamily: 'Cormorant Garamond', fontWeight: '600', color: '#4b3b3b', textAlign: 'center', width: 200 },
      { id: 'signature', type: 'image', role: 'signature', x: 875, y: 600, width: 150, height: 53 },
      { id: 'issuer', type: 'text', role: 'issuerName', x: 875, y: 655, fontSize: 14, fontFamily: 'Cormorant Garamond', fontWeight: '700', color: '#4b3b3b', textAlign: 'center', width: 220 },
    ],
    divider: { x: W / 2, y: 420, width: 250, color: '#a8455c' },
    seal: { x: W / 2, y: 645, radius: 40, ringColor: '#7c2d3e', innerColor: '#fdf2f4', starColor: '#7c2d3e', ribbonColor: '#c9a227' },
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    backgroundColor: '#f7f9fc',
    backgroundAccent: '#0f172a',
    borderColor: '#0f172a',
    accentColor: '#1d4ed8',
    headingLabel: 'CERTIFICATE OF RECOGNITION',
    width: W,
    height: H,
    elements: [
      { id: 'logo', type: 'image', role: 'logo', x: W / 2, y: 95, width: 75, height: 75 },
      { id: 'recipient', type: 'text', role: 'recipientName', x: W / 2, y: 340, fontSize: 50, fontFamily: 'Playfair Display', fontWeight: '900', color: '#1d4ed8', textAlign: 'center', width: 850 },
      { id: 'course', type: 'text', role: 'courseName', x: W / 2, y: 500, fontSize: 19, fontFamily: 'Montserrat', fontWeight: '500', color: '#334155', textAlign: 'center', width: 640 },
      { id: 'date', type: 'text', role: 'date', x: 220, y: 655, fontSize: 14, fontFamily: 'Montserrat', fontWeight: '500', color: '#334155', textAlign: 'center', width: 200 },
      { id: 'signature', type: 'image', role: 'signature', x: 875, y: 600, width: 140, height: 52 },
      { id: 'issuer', type: 'text', role: 'issuerName', x: 875, y: 655, fontSize: 13, fontFamily: 'Montserrat', fontWeight: '600', color: '#334155', textAlign: 'center', width: 220 },
    ],
    divider: { x: W / 2, y: 415, width: 210, color: '#1d4ed8' },
    seal: { x: W / 2, y: 645, radius: 40, ringColor: '#0f172a', innerColor: '#eef2f7', starColor: '#1d4ed8', ribbonColor: '#1d4ed8' },
  },
]

export function getTemplateById(id: string): CertificateTemplate {
  return templates.find(t => t.id === id) || templates[0]
}
