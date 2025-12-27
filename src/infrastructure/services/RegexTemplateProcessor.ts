import { App, TFile } from 'obsidian';
import { ITemplateProcessor } from '../../domain/services/ITemplateProcessor';
import { Template } from '../../domain/entities/Template';
import { TemplateContext } from '../../domain/entities/TemplateContext';

// Using moment which is globally available in Obsidian
declare const moment: any;

export class RegexTemplateProcessor implements ITemplateProcessor {
    process(template: Template, context: TemplateContext, app: App, file: TFile | null): Template {
        let processedTemplate = template;
        
        // Context for variables shared across blocks
        const sharedScope: Record<string, any> = {};

        // 1. Basic variables (Pre-processing)
        if (context.title !== undefined) {
            processedTemplate = processedTemplate.replace(/\{\{title\}\}/g, context.title);
        }
        if (context.folder !== undefined) {
            processedTemplate = processedTemplate.replace(/\{\{folder\}\}/g, context.folder);
        }

        // 2. Date/Time variables
        processedTemplate = processedTemplate.replace(/\{\{date\}\}/g, () => moment().format('YYYY-MM-DD'));
        processedTemplate = processedTemplate.replace(/\{\{time\}\}/g, () => moment().format('HH:mm'));
        processedTemplate = processedTemplate.replace(/\{\{date:([\s\S]*?)\}\}/g, (_, format) => {
            return moment().format(format);
        });

        // 3. Process Logic Blocks: << code >> (Produces NO output)
        // We escape the angle brackets just in case
        const logicBlockRegex = /<<(?!:)([\s\S]*?)>>/g;
        processedTemplate = processedTemplate.replace(logicBlockRegex, (_, code) => {
            try {
                // Using a normal string instead of a template literal for the function body to avoid interpolation issues
                const executor = new Function('app', 'moment', 'file', 'scope', 'with(scope) { ' + code + ' }');
                executor(app, moment, file, sharedScope);
                return ''; 
            } catch (e) {
                console.error('Template Hub - Error in logic block:', e);
                return '## LOGIC ERROR: ' + (e as any).message + ' ##';
            }
        });

        // 4. Process Output Blocks: <<: expression >> (Produces output)
        const outputBlockRegex = /<<:([\s\S]*?)>>/g;
        processedTemplate = processedTemplate.replace(outputBlockRegex, (_, expression) => {
            try {
                const evaluator = new Function('app', 'moment', 'file', 'scope', 'with(scope) { return (' + expression + '); }');
                const result = evaluator(app, moment, file, sharedScope);
                return result !== null && result !== undefined ? String(result) : '';
            } catch (e) {
                console.error('Template Hub - Error in output block:', e);
                return '## OUTPUT ERROR: ' + (e as any).message + ' ##';
            }
        });

        // 5. Compatibility with legacy {{eval:...}}
        processedTemplate = processedTemplate.replace(/\{\{eval:([\s\S]*?)\}\}/g, (_, code) => {
            try {
                const sandboxedFn = new Function('app', 'moment', 'file', 'scope', 'with(scope) { ' + code + ' }');
                const result = sandboxedFn(app, moment, file, sharedScope);
                return result !== null && result !== undefined ? String(result) : '';
            } catch (e) {
                console.error('Template Hub - Error executing eval block:', e);
                return '## EVAL ERROR: ' + (e as any).message + ' ##';
            }
        });
        
        return processedTemplate;
    }
}