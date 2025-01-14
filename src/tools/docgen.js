import { parse } from 'react-docgen-typescript';
const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
};
export function generateComponentDocs(componentPath) {
    const docs = parse(componentPath, options);
    return docs.map(doc => ({
        name: doc.displayName,
        description: doc.description,
        props: doc.props,
        examples: doc.tags?.example || [],
    }));
}
//# sourceMappingURL=docgen.js.map