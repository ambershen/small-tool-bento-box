import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent, PointerEvent } from 'react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Download,
  ImagePlus,
  MousePointer2,
  Plus,
  Sparkles,
  Trash2,
  Type,
} from 'lucide-react'
import { downloadNodeAsPng } from './lib/exportImage'

type ElementKind = 'text' | 'label'
type TextAlign = 'left' | 'center' | 'right'
type FontFamily = 'hand' | 'mono' | 'serif' | 'sans'

type CoverElement = {
  id: string
  kind: ElementKind
  text: string
  x: number
  y: number
  width: number
  size: number
  color: string
  align: TextAlign
  font: FontFamily
  rotate: number
  letterSpacing: number
  lineHeight: number
}

type Template = {
  name: string
  background: string
  filter: string
  grain: number
  elements: CoverElement[]
}

const fontOptions: { value: FontFamily; label: string }[] = [
  { value: 'hand', label: 'Handwritten' },
  { value: 'serif', label: 'Editorial' },
  { value: 'sans', label: 'Clean Sans' },
  { value: 'mono', label: 'Mono Note' },
]

const templateLibrary: Template[] = [
  {
    name: 'Beach Note',
    background:
      'linear-gradient(180deg, #876f55 0 12%, #b1a089 12% 40%, #5b93a0 40% 54%, #b99467 54% 70%, #86735d 70%)',
    filter: 'contrast(0.92) saturate(0.78) brightness(0.92)',
    grain: 0.42,
    elements: [
      {
        id: 't-1',
        kind: 'text',
        text: 'The\nsense\nof the\nworld\nmust lie outside\nthe world.',
        x: 8,
        y: 16,
        width: 74,
        size: 58,
        color: '#fffaf0',
        align: 'left',
        font: 'hand',
        rotate: -2,
        letterSpacing: 0.8,
        lineHeight: 1.32,
      },
      {
        id: 't-2',
        kind: 'label',
        text: '@outlier',
        x: 63,
        y: 87,
        width: 22,
        size: 24,
        color: '#fffaf0',
        align: 'left',
        font: 'hand',
        rotate: -3,
        letterSpacing: 0.6,
        lineHeight: 1.1,
      },
    ],
  },
  {
    name: 'Memory Sky',
    background:
      'linear-gradient(180deg, #8db1c9 0 22%, #c3d2d6 22% 47%, #6e97a0 47% 58%, #25382c 58% 84%, #6d6445 84%)',
    filter: 'contrast(0.86) saturate(0.82) brightness(0.94)',
    grain: 0.36,
    elements: [
      {
        id: 't-1',
        kind: 'text',
        text: 'Die\nwith\nmemories\n,\nnot\ndreams.',
        x: 25,
        y: 14,
        width: 50,
        size: 62,
        color: '#f7f3ea',
        align: 'center',
        font: 'hand',
        rotate: 1,
        letterSpacing: 1.2,
        lineHeight: 1.55,
      },
      {
        id: 't-2',
        kind: 'label',
        text: '@OUTLIER',
        x: 40,
        y: 90,
        width: 28,
        size: 22,
        color: '#f8f4e8',
        align: 'center',
        font: 'serif',
        rotate: 0,
        letterSpacing: 1.5,
        lineHeight: 1,
      },
    ],
  },
  {
    name: 'Socratic Window',
    background:
      'linear-gradient(90deg, rgba(7, 6, 8, .52) 0 22%, rgba(120, 104, 90, .35) 22% 45%, rgba(22, 10, 9, .76) 45% 62%, rgba(68, 102, 114, .58) 62%), linear-gradient(180deg, #87b3c8 0 42%, #537e87 42% 55%, #192519 55% 78%, #1c0908 78%)',
    filter: 'contrast(0.9) saturate(0.86) brightness(0.83)',
    grain: 0.48,
    elements: [
      {
        id: 't-1',
        kind: 'text',
        text: '”\nThe only true wisdom is\nin knowing you know\nnothing.',
        x: 44,
        y: 30,
        width: 44,
        size: 35,
        color: '#fff8e8',
        align: 'left',
        font: 'hand',
        rotate: 0,
        letterSpacing: 0.2,
        lineHeight: 1.22,
      },
      {
        id: 't-2',
        kind: 'label',
        text: '24\nSep.\n2025',
        x: 7,
        y: 49,
        width: 18,
        size: 34,
        color: '#f7db4a',
        align: 'left',
        font: 'serif',
        rotate: 0,
        letterSpacing: -0.8,
        lineHeight: 0.82,
      },
      {
        id: 't-3',
        kind: 'label',
        text: 'Socrates ━━━',
        x: 61,
        y: 60,
        width: 30,
        size: 25,
        color: '#fff8e8',
        align: 'left',
        font: 'hand',
        rotate: -1,
        letterSpacing: 0.5,
        lineHeight: 1,
      },
    ],
  },
]

const backgroundPresets = [
  '#7f6d58',
  '#88a9bc',
  '#213b22',
  '#1e1a1d',
  'linear-gradient(180deg, #93b7ce 0 40%, #35513c 40% 82%, #8b744f 82%)',
]

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function makeElement(partial?: Partial<CoverElement>): CoverElement {
  return {
    id: crypto.randomUUID(),
    kind: 'text',
    text: 'New thought\nfor Rednote',
    x: 18,
    y: 28,
    width: 58,
    size: 46,
    color: '#fff8ee',
    align: 'center',
    font: 'hand',
    rotate: 0,
    letterSpacing: 0.4,
    lineHeight: 1.25,
    ...partial,
  }
}

function App() {
  const [templateIndex, setTemplateIndex] = useState(1)
  const [elements, setElements] = useState<CoverElement[]>(templateLibrary[1].elements)
  const [selectedId, setSelectedId] = useState(elements[0]?.id ?? '')
  const [background, setBackground] = useState(templateLibrary[1].background)
  const [filter, setFilter] = useState(templateLibrary[1].filter)
  const [grain, setGrain] = useState(templateLibrary[1].grain)
  const [isExporting, setIsExporting] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => elements.find((element) => element.id === selectedId) ?? elements[0],
    [elements, selectedId],
  )

  const updateElement = (id: string, updates: Partial<CoverElement>) => {
    setElements((current) =>
      current.map((element) => (element.id === id ? { ...element, ...updates } : element)),
    )
  }

  const applyTemplate = (index: number) => {
    const template = templateLibrary[index]
    setTemplateIndex(index)
    setElements(template.elements.map((element) => ({ ...element, id: crypto.randomUUID() })))
    setBackground(template.background)
    setFilter(template.filter)
    setGrain(template.grain)
    setSelectedId('')
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingId || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const element = elements.find((item) => item.id === draggingId)
    if (!element) return
    updateElement(draggingId, {
      x: Math.max(0, Math.min(100 - element.width, x)),
      y: Math.max(0, Math.min(96, y)),
    })
  }

  const handleBackgroundUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setBackground(`url(${dataUrl}) center / cover no-repeat`)
  }

  const exportCover = async () => {
    if (!stageRef.current) return
    setSelectedId('')
    setIsExporting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 80))
    await downloadNodeAsPng(stageRef.current, `rednote-cover-${Date.now()}.png`)
    setIsExporting(false)
  }

  const addText = () => {
    const next = makeElement({ y: 18 + elements.length * 8 })
    setElements((current) => [...current, next])
    setSelectedId(next.id)
  }

  const removeSelected = () => {
    if (!selected) return
    setElements((current) => current.filter((element) => element.id !== selected.id))
    setSelectedId(elements.find((element) => element.id !== selected.id)?.id ?? '')
  }

  return (
    <main className="min-h-screen bg-[#14110f] text-[#f6efe7]">
      <section className="mx-auto grid max-w-[1440px] gap-6 px-4 py-5 lg:grid-cols-[360px_minmax(360px,1fr)_340px] lg:px-6">
        <aside className="panel space-y-5">
          <div>
            <p className="eyebrow">Small Tool Bento Box</p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-[0.88] tracking-[-0.08em]">
              Rednote<br />Cover<br />Studio.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#d7cabc]">
              Compose image-first quote covers with a tactile Rednote mood: grain,
              hand lettering, vertical crop, draggable type, and one-click PNG export.
            </p>
          </div>

          <div className="control-group">
            <label className="control-label">Template</label>
            <div className="grid gap-2">
              {templateLibrary.map((template, index) => (
                <button
                  className={`template-button ${templateIndex === index ? 'is-active' : ''}`}
                  key={template.name}
                  onClick={() => applyTemplate(index)}
                >
                  <Sparkles size={15} />
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Background</label>
            <label className="upload-zone">
              <ImagePlus size={20} />
              Upload photo background
              <input accept="image/*" className="sr-only" onChange={handleBackgroundUpload} type="file" />
            </label>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {backgroundPresets.map((preset) => (
                <button
                  aria-label="Apply color background"
                  className="swatch"
                  key={preset}
                  onClick={() => setBackground(preset)}
                  style={{ background: preset }}
                />
              ))}
            </div>
          </div>

          <div className="control-grid">
            <label>
              <span>Grain</span>
              <input max="0.8" min="0" onChange={(event) => setGrain(Number(event.target.value))} step="0.02" type="range" value={grain} />
            </label>
            <label>
              <span>Image tone</span>
              <select onChange={(event) => setFilter(event.target.value)} value={filter}>
                <option value="contrast(0.92) saturate(0.78) brightness(0.92)">Muted film</option>
                <option value="contrast(1.06) saturate(1.1) brightness(0.95)">Punchy</option>
                <option value="sepia(0.28) contrast(0.9) brightness(0.9)">Sepia note</option>
                <option value="grayscale(0.35) contrast(0.95) brightness(0.88)">Soft mono</option>
              </select>
            </label>
          </div>

          <button className="download-button" disabled={isExporting} onClick={exportCover}>
            <Download size={18} />
            {isExporting ? 'Rendering PNG…' : 'Download PNG'}
          </button>
        </aside>

        <section className="preview-shell">
          <div className="preview-toolbar">
            <span><MousePointer2 size={15} /> Drag text on canvas</span>
            <span>1080 × 1620 Rednote ratio</span>
          </div>
          <div
            className="cover-stage"
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDraggingId(null)}
            ref={stageRef}
            style={{ background, filter }}
          >
            <div className="grain" style={{ opacity: grain }} />
            <div className="watermark">小红书号：95069960448</div>
            {elements.map((element) => (
              <button
                className={`cover-element font-${element.font} ${selectedId === element.id ? 'is-selected' : ''}`}
                key={element.id}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId)
                  setSelectedId(element.id)
                  setDraggingId(element.id)
                }}
                style={{
                  color: element.color,
                  fontSize: `${element.size}px`,
                  left: `${element.x}%`,
                  letterSpacing: `${element.letterSpacing}px`,
                  lineHeight: element.lineHeight,
                  textAlign: element.align,
                  top: `${element.y}%`,
                  transform: `rotate(${element.rotate}deg)`,
                  width: `${element.width}%`,
                }}
                type="button"
              >
                {element.text}
              </button>
            ))}
          </div>
        </section>

        <aside className="panel space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Layers</p>
              <h2 className="text-xl font-black uppercase">Text blocks</h2>
            </div>
            <button className="icon-button" onClick={addText} title="Add text" type="button">
              <Plus size={18} />
            </button>
          </div>

          <div className="layer-list">
            {elements.map((element) => (
              <button
                className={selectedId === element.id ? 'is-active' : ''}
                key={element.id}
                onClick={() => setSelectedId(element.id)}
                type="button"
              >
                <Type size={14} />
                <span>{element.text.split('\n').join(' ').slice(0, 34)}</span>
              </button>
            ))}
          </div>

          {selected ? (
            <div className="editor space-y-4">
              <label>
                <span>Copy</span>
                <textarea onChange={(event) => updateElement(selected.id, { text: event.target.value })} value={selected.text} />
              </label>

              <div className="control-grid">
                <label>
                  <span>Font</span>
                  <select onChange={(event) => updateElement(selected.id, { font: event.target.value as FontFamily })} value={selected.font}>
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Color</span>
                  <input onChange={(event) => updateElement(selected.id, { color: event.target.value })} type="color" value={selected.color} />
                </label>
              </div>

              <div className="align-row">
                {(['left', 'center', 'right'] as TextAlign[]).map((align) => (
                  <button
                    className={selected.align === align ? 'is-active' : ''}
                    key={align}
                    onClick={() => updateElement(selected.id, { align })}
                    type="button"
                  >
                    {align === 'left' ? <AlignLeft size={16} /> : null}
                    {align === 'center' ? <AlignCenter size={16} /> : null}
                    {align === 'right' ? <AlignRight size={16} /> : null}
                  </button>
                ))}
              </div>

              <div className="control-grid">
                <label><span>X</span><input max="95" min="0" onChange={(event) => updateElement(selected.id, { x: Number(event.target.value) })} type="range" value={selected.x} /></label>
                <label><span>Y</span><input max="96" min="0" onChange={(event) => updateElement(selected.id, { y: Number(event.target.value) })} type="range" value={selected.y} /></label>
                <label><span>Width</span><input max="95" min="10" onChange={(event) => updateElement(selected.id, { width: Number(event.target.value) })} type="range" value={selected.width} /></label>
                <label><span>Size</span><input max="104" min="14" onChange={(event) => updateElement(selected.id, { size: Number(event.target.value) })} type="range" value={selected.size} /></label>
                <label><span>Rotate</span><input max="20" min="-20" onChange={(event) => updateElement(selected.id, { rotate: Number(event.target.value) })} type="range" value={selected.rotate} /></label>
                <label><span>Line</span><input max="2" min="0.75" onChange={(event) => updateElement(selected.id, { lineHeight: Number(event.target.value) })} step="0.05" type="range" value={selected.lineHeight} /></label>
              </div>

              <button className="danger-button" onClick={removeSelected} type="button">
                <Trash2 size={16} /> Remove selected layer
              </button>
            </div>
          ) : (
            <p className="empty-note">Add or select a layer to edit typography.</p>
          )}
        </aside>
      </section>
    </main>
  )
}

export default App
