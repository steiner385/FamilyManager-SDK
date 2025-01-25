import { ExtensionRegistry } from '../core/ui/ExtensionRegistry'
import { DynamicComponent } from './DynamicComponent'

interface ExtensionPointProps {
  id: string
  className?: string
}

export function ExtensionPoint({ id, className = '' }: ExtensionPointProps) {
  const registry = ExtensionRegistry.getInstance()
  const extensions = registry.getExtensions(id)

  return (
    <div className={className}>
      {extensions.map(({ id: componentId, props }, index) => (
        <DynamicComponent
          key={`${componentId}-${index}`}
          id={componentId}
          props={props}
        />
      ))}
    </div>
  )
}
