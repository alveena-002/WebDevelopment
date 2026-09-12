import jsPDF from 'jspdf'

// Fabric canvas ko PDF me export karta hai (landscape)
export function canvasToPDF(canvasDataUrl: string, widthPx: number, heightPx: number): jsPDF {
  const orientation = widthPx > heightPx ? 'landscape' : 'portrait'
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [widthPx, heightPx],
  })
  pdf.addImage(canvasDataUrl, 'PNG', 0, 0, widthPx, heightPx)
  return pdf
}

export function downloadPDF(canvasDataUrl: string, widthPx: number, heightPx: number, fileName: string) {
  const pdf = canvasToPDF(canvasDataUrl, widthPx, heightPx)
  pdf.save(fileName)
}
