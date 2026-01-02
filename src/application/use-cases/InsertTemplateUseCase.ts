import { App, TFile } from 'obsidian';
import { Template } from '../../domain/entities/Template';
import { TemplateContext } from '../../domain/entities/TemplateContext';
import { ITemplateProcessor, ProcessedTemplate } from '../../domain/services/ITemplateProcessor';

export class InsertTemplateUseCase {
    constructor(private templateProcessor: ITemplateProcessor) {}

    execute(template: Template, activeFile: TFile | null, app: App, project?: string, type?: string): ProcessedTemplate {
        const context: TemplateContext = {
            project: project,
            type: type
        };

        if (activeFile) {
            context.title = activeFile.basename;
            context.folder = activeFile.parent?.path ?? '';
        }

        return this.templateProcessor.process(template, context, app, activeFile);
    }
}
