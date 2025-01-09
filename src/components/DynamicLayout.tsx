import { LayoutManager } from '../core/layout/LayoutManager'
import { DynamicComponent } from './DynamicComponent'

interface DynamicLayoutProps {
  layoutId: string
  className?: string
}

export function DynamicLayout({ layoutId, className = '' }: DynamicLayoutProps) {
  const manager = LayoutManager.getInstance()
  const layout = manager.getLayout(layoutId)

  if (!layout) {
    console.warn(`Layout "${layoutId}" not found`)
    return null
  }

  const gridTemplateAreas = layout.areas
    .map(row => `"${row.join(' ')}"`)
    .join(' ')

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateAreas,
        gap: '1rem'
      }}
    >
      {Object.entries(layout.components).map(([area, config]) => (
        <div key={area} style={{ gridArea: area }}>
          <DynamicComponent
            id={config.componentId}
            props={config.props}
          />
        </div>
      ))}
    </div>
  )
}
