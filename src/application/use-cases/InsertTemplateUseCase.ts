import { App, TFile } from 'obsidian';
import { Template } from '../../domain/entities/Template';
import { TemplateContext } from '../../domain/entities/TemplateContext';
import { ITemplateProcessor } from '../../domain/services/ITemplateProcessor';

export class InsertTemplateUseCase {
    constructor(private templateProcessor: ITemplateProcessor) {}

    execute(template: Template, activeFile: TFile | null, app: App): Template {
        if (!activeFile) {
            // If there's no active file, we can only process timeless variables
            const context: TemplateContext = {};
            return this.templateProcessor.process(template, context, app, null);
        }

        const context: TemplateContext = {
            title: activeFile.basename,
            folder: activeFile.parent?.path ?? '',
        };

        return this.templateProcessor.process(template, context, app, activeFile);
    }
}
