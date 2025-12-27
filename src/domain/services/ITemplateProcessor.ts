import { App, TFile } from 'obsidian';
import { Template } from '../entities/Template';
import { TemplateContext } from '../entities/TemplateContext';

export interface ProcessedTemplate {
    content: Template;
    renameTo?: string;
    moveToFolder?: string;
}

export interface ITemplateProcessor {
    process(template: Template, context: TemplateContext, app: App, file: TFile | null): ProcessedTemplate;
}
