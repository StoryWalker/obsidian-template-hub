import { App, TFile } from 'obsidian';
import { ITemplateProcessor } from '../../domain/services/ITemplateProcessor';
import { Template } from '../../domain/entities/Template';
import { TemplateContext } from '../../domain/entities/TemplateContext';

// Using moment which is globally available in Obsidian
declare const moment: any;

export class RegexTemplateProcessor implements ITemplateProcessor {
    process(template: Template, context: TemplateContext, app: App, file: TFile | null): Template {
        let processedTemplate = template;

        // Basic variables - replace if defined
        if (context.title !== undefined) {
            processedTemplate = processedTemplate.replace(/\{\{title\}\}/g, context.title);
        }
        if (context.folder !== undefined) {
            processedTemplate = processedTemplate.replace(/\{\{folder\}\}/g, context.folder);
        }

        // Date/Time variables
        processedTemplate = processedTemplate.replace(/\{\{date\}\}/g, moment().format('YYYY-MM-DD'));
        processedTemplate = processedTemplate.replace(/\{\{time\}\}/g, moment().format('HH:mm'));
        processedTemplate = processedTemplate.replace(/\{\{date:(.*?)\}\}/g, (_, format) => {
            return moment().format(format);
        });

        // Advanced: JavaScript evaluation
        processedTemplate = processedTemplate.replace(/\{\{eval:((.|\n)*?)\}\}/g, (_, code) => {
            try {
                // Create a sandboxed function. Pass `app`, `moment` and `file` for convenience.
                const sandboxedFn = new Function('app', 'moment', 'file', code);
                const result = sandboxedFn(app, moment, file);
                return result !== null && result !== undefined ? String(result) : '';
            } catch (e) {
                console.error('Template Hub - Error executing eval block:', e);
                return `## EVAL ERROR: ${(e as any).message} ##`;
            }
        });
        
        return processedTemplate;
    }
}
