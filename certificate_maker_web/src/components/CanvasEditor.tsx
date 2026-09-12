import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react'
import { fabric } from 'fabric'
import { CertificateTemplate, CertificateData } from '../types/certificate'

interface CanvasEditorProps {
  template: CertificateTemplate
  data: CertificateData
}

export interface CanvasEditorHandle {
  exportDataUrl: () => string
  getSize: () => { width: number; height: number }
}

// 5-pointed star ke points calculate karta hai (seal ke andar ka star)
function getStarPoints(cx: number, cy: number, outerR: number, innerR: number, spikes = 5) {
  const points: { x: number; y: number }[] = []
  let rot = (Math.PI / 2) * 3
  const step = Math.PI / spikes
  for (let i = 0; i < spikes; i++) {
    points.push({ x: cx + Math.cos(rot) * outerR, y: cy + Math.sin(rot) * outerR })
    rot += step
    points.push({ x: cx + Math.cos(rot) * innerR, y: cy + Math.sin(rot) * innerR })
    rot += step
  }
  return points
}

// Corner ke liye decorative L-bracket banata hai (double line)
function addCornerOrnament(canvas: fabric.Canvas, x: number, y: number, flipX: boolean, flipY: boolean, color: string) {
  const size = 55
  const path = `M 0 ${size} L 0 0 L ${size} 0`
  const outer = new fabric.Path(path, {
    left: x, top: y,
    stroke: color, strokeWidth: 3, fill: '',
    scaleX: flipX ? -1 : 1, scaleY: flipY ? -1 : 1,
    selectable: false, evented: false,
  })
  const innerPath = `M 0 ${size - 14} L 0 0 L ${size - 14} 0`
  const inner = new fabric.Path(innerPath, {
    left: x + (flipX ? -8 : 8), top: y + (flipY ? -8 : 8),
    stroke: color, strokeWidth: 1, fill: '',
    scaleX: flipX ? -1 : 1, scaleY: flipY ? -1 : 1,
    selectable: false, evented: false,
  })
  const dot = new fabric.Circle({
    left: x - 4, top: y - 4, radius: 4, fill: color, selectable: false, evented: false,
  })
  canvas.add(outer, inner, dot)
}

// Achievement seal / medallion badge banata hai (ribbon tails + circle + star)
function addSeal(canvas: fabric.Canvas, seal: NonNullable<CertificateTemplate['seal']>) {
  const { x, y, radius, ringColor, innerColor, starColor, ribbonColor } = seal

  const tailW = radius * 0.5
  const tailH = radius * 1.1
  const tailLeft = new fabric.Triangle({
    left: x - radius * 0.35, top: y + radius - 8, width: tailW, height: tailH,
    fill: ribbonColor, angle: 20, originX: 'center', originY: 'top', selectable: false, evented: false,
  })
  const tailRight = new fabric.Triangle({
    left: x + radius * 0.35, top: y + radius - 8, width: tailW, height: tailH,
    fill: ribbonColor, angle: -20, originX: 'center', originY: 'top', selectable: false, evented: false,
  })
  canvas.add(tailLeft, tailRight)

  const outerCircle = new fabric.Circle({
    left: x, top: y, radius, fill: ringColor, originX: 'center', originY: 'center', selectable: false, evented: false,
  })
  const innerCircle = new fabric.Circle({
    left: x, top: y, radius: radius - 8, fill: innerColor, originX: 'center', originY: 'center',
    stroke: ringColor, strokeWidth: 1.5, selectable: false, evented: false,
  })
  canvas.add(outerCircle, innerCircle)

  const starPts = getStarPoints(x, y, radius - 20, (radius - 20) / 2.3)
  const star = new fabric.Polygon(starPts, {
    fill: starColor, selectable: false, evented: false,
  })
  canvas.add(star)
}

// Decorative divider line with center diamond
function addDivider(canvas: fabric.Canvas, divider: NonNullable<CertificateTemplate['divider']>) {
  const { x, y, width, color } = divider
  const lineLeft = new fabric.Line([x - width / 2, y, x - 12, y], { stroke: color, strokeWidth: 1.5, selectable: false, evented: false })
  const lineRight = new fabric.Line([x + 12, y, x + width / 2, y], { stroke: color, strokeWidth: 1.5, selectable: false, evented: false })
  const diamond = new fabric.Rect({
    left: x, top: y, width: 12, height: 12, fill: color, angle: 45, originX: 'center', originY: 'center', selectable: false, evented: false,
  })
  canvas.add(lineLeft, lineRight, diamond)
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  if (isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const CanvasEditor = forwardRef<CanvasEditorHandle, CanvasEditorProps>(({ template, data }, ref) => {
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)

  useImperativeHandle(ref, () => ({
    exportDataUrl: () => {
      if (!fabricRef.current) return ''
      return fabricRef.current.toDataURL({ format: 'png', quality: 1, multiplier: 2 })
    },
    getSize: () => ({ width: template.width, height: template.height }),
  }))

  useEffect(() => {
    if (!canvasElRef.current) return
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: template.width,
      height: template.height,
      selection: true,
    })
    fabricRef.current = canvas
    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  }, [])

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const render = () => {
      canvas.clear()
      canvas.setWidth(template.width)
      canvas.setHeight(template.height)
      canvas.backgroundColor = template.backgroundColor
      const W = template.width
      const H = template.height

      const watermark = new fabric.Circle({
        left: W - 60, top: H - 60, radius: 220,
        fill: template.backgroundAccent, opacity: 0.045,
        originX: 'center', originY: 'center', selectable: false, evented: false,
      })
      canvas.add(watermark)

      canvas.add(new fabric.Rect({
        left: 22, top: 22, width: W - 44, height: H - 44,
        fill: 'transparent', stroke: template.borderColor, strokeWidth: 4,
        selectable: false, evented: false,
      }))
      canvas.add(new fabric.Rect({
        left: 34, top: 34, width: W - 68, height: H - 68,
        fill: 'transparent', stroke: template.borderColor, strokeWidth: 1,
        selectable: false, evented: false,
      }))

      const m = 34
      addCornerOrnament(canvas, m, m, false, false, template.accentColor)
      addCornerOrnament(canvas, W - m, m, true, false, template.accentColor)
      addCornerOrnament(canvas, m, H - m, false, true, template.accentColor)
      addCornerOrnament(canvas, W - m, H - m, true, true, template.accentColor)

      const heading = new fabric.Textbox(template.headingLabel, {
        left: W / 2, top: 200, fontSize: 26, fontFamily: 'Playfair Display', fontWeight: '700',
        fill: template.accentColor, textAlign: 'center', originX: 'center', originY: 'center',
        width: 700, charSpacing: 150,
      })
      canvas.add(heading)

      const presented = new fabric.Textbox('This certificate is proudly presented to', {
        left: W / 2, top: 250, fontSize: 15, fontFamily: 'Montserrat', fontStyle: 'italic',
        fill: '#6b6b6b', textAlign: 'center', originX: 'center', originY: 'center', width: 700,
      })
      canvas.add(presented)

      const inRecognition = new fabric.Textbox('IN RECOGNITION OF SUCCESSFULLY COMPLETING', {
        left: W / 2, top: 455, fontSize: 12, fontFamily: 'Montserrat', fontWeight: '600',
        fill: '#8a8a8a', textAlign: 'center', originX: 'center', originY: 'center', width: 700, charSpacing: 120,
      })
      canvas.add(inRecognition)

      if (template.divider) addDivider(canvas, template.divider)

      template.elements.filter(el => el.type === 'text').forEach(el => {
        let text = ''
        switch (el.role) {
          case 'recipientName': text = data.recipientName || 'Recipient Name'; break
          case 'courseName': text = data.courseName || 'Course / Program Name'; break
          case 'date': text = data.date ? formatDate(data.date) : 'Date'; break
          case 'issuerName': text = data.issuerName || 'Issuer Name'; break
        }
        const textObj = new fabric.Textbox(text, {
          left: el.x, top: el.y,
          fontSize: el.fontSize || 24,
          fontFamily: el.fontFamily || 'Arial',
          fontWeight: el.fontWeight || 'normal',
          fontStyle: (el.fontStyle as any) || 'normal',
          fill: el.color || '#000',
          textAlign: el.textAlign || 'center',
          originX: 'center', originY: 'center',
          width: el.width || 500,
          charSpacing: el.letterSpacing || 0,
        })
        canvas.add(textObj)

        // Consistent order for both: thin line above, value on the line, small caption below
        if (el.role === 'date') {
          canvas.add(new fabric.Line([el.x - 100, el.y - 24, el.x + 100, el.y - 24], { stroke: '#bbb', strokeWidth: 1 }))
          canvas.add(new fabric.Textbox('DATE', { left: el.x, top: el.y + 20, fontSize: 10, fontFamily: 'Montserrat', fontWeight: '700', fill: '#999', textAlign: 'center', originX: 'center', originY: 'center', width: 200, charSpacing: 150 }))
        }
        if (el.role === 'issuerName') {
          canvas.add(new fabric.Line([el.x - 100, el.y - 24, el.x + 100, el.y - 24], { stroke: '#bbb', strokeWidth: 1 }))
          canvas.add(new fabric.Textbox('AUTHORIZED SIGNATURE', { left: el.x, top: el.y + 20, fontSize: 10, fontFamily: 'Montserrat', fontWeight: '700', fill: '#999', textAlign: 'center', originX: 'center', originY: 'center', width: 240, charSpacing: 120 }))
        }
      })

      if (template.seal) addSeal(canvas, template.seal)

      template.elements.filter(el => el.type === 'image').forEach(el => {
        let src = ''
        if (el.role === 'logo') src = data.logoUrl || ''
        if (el.role === 'signature') src = data.signatureUrl || ''
        if (!src) return
        fabric.Image.fromURL(src, (img) => {
          const w = el.width || 100
          const h = el.height || 100
          img.set({ left: el.x, top: el.y, originX: 'center', originY: 'center' })
          img.scaleToWidth(w)
          if (img.getScaledHeight() > h) img.scaleToHeight(h)
          canvas.add(img)
          canvas.renderAll()
        })
      })

      canvas.renderAll()
    }

    if ((document as any).fonts && (document as any).fonts.ready) {
      ;(document as any).fonts.ready.then(render)
    } else {
      render()
    }
  }, [template, data])

  return <canvas ref={canvasElRef} />
})

export default CanvasEditor
