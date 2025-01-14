import { parse } from 'react-docgen-typescript';
import fs from 'fs';
import path from 'path';
export class ComponentDocGenerator {
    static generateDocs(componentPath) {
        const docs = parse(componentPath)[0];
        return {
            name: docs.displayName,
            description: docs.description,
            props: this.formatProps(docs.props),
            examples: this.extractExamples(componentPath),
        };
    }
    static formatProps(props) {
        return Object.entries(props).reduce((acc, [name, prop]) => ({
            ...acc,
            [name]: {
                description: prop.description,
                type: prop.type.name,
                required: prop.required,
                defaultValue: prop.defaultValue?.value,
            },
        }), {});
    }
    static extractExamples(componentPath) {
        const content = fs.readFileSync(componentPath, 'utf-8');
        const examples = content.match(/\/\*\*\s*@example([\s\S]*?)\*\//g) || [];
        return examples.map(example => example.replace(/\/\*\*\s*@example\s*|\*\//g, '').trim());
    }
    static generateMarkdown(doc) {
        return `
# ${doc.name}

${doc.description}

## Props

${Object.entries(doc.props)
            .map(([name, prop]) => `
### ${name}${prop.required ? ' (required)' : ''}

- Type: \`${prop.type}\`
${prop.defaultValue ? `- Default: \`${prop.defaultValue}\`` : ''}

${prop.description}
`)
            .join('\n')}

## Examples

${doc.examples
            .map(example => `
\`\`\`tsx
${example}
\`\`\`
`)
            .join('\n')}
`;
    }
    static async generateDocsForDirectory(dir) {
        const files = await fs.promises.readdir(dir);
        for (const file of files) {
            if (file.endsWith('.tsx')) {
                const componentPath = path.join(dir, file);
                const doc = this.generateDocs(componentPath);
                const markdown = this.generateMarkdown(doc);
                await fs.promises.writeFile(path.join(this.outputPath, `${doc.name}.md`), markdown);
            }
        }
    }
}
ComponentDocGenerator.outputPath = 'docs/components';
//# sourceMappingURL=ComponentDocGenerator.js.map