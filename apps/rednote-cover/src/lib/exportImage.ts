function collectPageStyles() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      const rules = sheet.cssRules
      return Array.from(rules).map((rule) => rule.cssText).join('\n')
    })
    .join('\n')
}

export async function downloadNodeAsPng(node: HTMLElement, filename: string) {
  const { width, height } = node.getBoundingClientRect()
  const clonedNode = node.cloneNode(true) as HTMLElement
  clonedNode.style.transform = 'none'
  clonedNode.style.margin = '0'
  clonedNode.style.width = `${width}px`
  clonedNode.style.height = `${height}px`

  const serializedNode = new XMLSerializer().serializeToString(clonedNode)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${collectPageStyles()}</style>
          ${serializedNode}
        </div>
      </foreignObject>
    </svg>
  `
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not render the cover preview.'))
    img.src = url
  })

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * 2)
  canvas.height = Math.round(height * 2)
  const context = canvas.getContext('2d')

  if (!context) {
    URL.revokeObjectURL(url)
    throw new Error('Canvas is not available in this browser.')
  }

  context.fillStyle = '#14110f'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  URL.revokeObjectURL(url)

  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
