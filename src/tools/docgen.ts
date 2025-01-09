import { parse } from 'react-docgen-typescript'
import fs from 'fs'
import path from 'path'

const options = {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
}

export function generateComponentDocs(componentPath: string) {
  const docs = parse(componentPath, options)
  
  return docs.map(doc => ({
    name: doc.displayName,
    description: doc.description,
    props: doc.props,
    examples: doc.tags?.example || [],
  }))
}
