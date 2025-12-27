import { Plugin, Notice, Editor, TFile, MarkdownView } from 'obsidian';
import { TemplateManagerSettingTab } from './infrastructure/ui/SettingTab';
import { TemplateManagerSettings, DEFAULT_SETTINGS } from './infrastructure/settings/settings';
import { TemplateSuggestModal } from './infrastructure/ui/TemplateSuggestModal';
import { RegexTemplateProcessor } from './infrastructure/services/RegexTemplateProcessor';
import { InsertTemplateUseCase } from './application/use-cases/InsertTemplateUseCase';

export default class TemplateManagerPlugin extends Plugin {
    settings: TemplateManagerSettings;
    ribbonIconEl: HTMLElement | null = null;
    
    // Services and Use Cases
    private templateProcessor: RegexTemplateProcessor;
    private insertTemplateUseCase: InsertTemplateUseCase;

    async onload() {
        console.log('Loading Template Manager plugin...');

        // Initialize services and use cases
        this.templateProcessor = new RegexTemplateProcessor();
        this.insertTemplateUseCase = new InsertTemplateUseCase(this.templateProcessor);

        await this.loadSettings();
        this.updateRibbonIcon();

        this.addSettingTab(new TemplateManagerSettingTab(this.app, this));

        this.addCommand({
            id: 'insert-template',
            name: 'Insert template',
            callback: () => this.showInsertTemplateModal(),
        });

        this.addCommand({
            id: 'show-template-folder-path',
            name: 'Show template folder path',
            callback: () => {
                new Notice(`Current template folder path is: ${this.settings.templateFolderPath}`);
            }
        });
    }

    private showInsertTemplateModal() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            new Notice('Please open a note to insert a template.');
            return;
        }
        const editor = activeView.editor;

        const { templateFolderPath } = this.settings;
        if (!templateFolderPath) {
            new Notice('Template folder path is not set. Please configure it in the plugin settings.');
            return;
        }

        const allFiles = this.app.vault.getFiles();
        const templates = allFiles.filter(file =>
            file.path.startsWith(templateFolderPath + '/') && file.extension === 'md'
        );

        if (templates.length === 0) {
            new Notice(`No templates found in the folder: ${templateFolderPath}`);
            return;
        }

        new TemplateSuggestModal(this.app, templates, async (selectedTemplate) => {
            const content = await this.app.vault.read(selectedTemplate);
            const activeFile = this.app.workspace.getActiveFile();
            const processedContent = this.insertTemplateUseCase.execute(content, activeFile, this.app);
            editor.replaceSelection(processedContent);
        }).open();
    }

    onunload() {
        console.log('Unloading Template Manager plugin.');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    public updateRibbonIcon() {
        if (this.ribbonIconEl) {
            this.ribbonIconEl.remove();
            this.ribbonIconEl = null;
        }

        if (this.settings.showRibbonIcon && this.settings.ribbonIcon) {
            this.ribbonIconEl = this.addRibbonIcon(this.settings.ribbonIcon, 'Insert template', () => {
                this.showInsertTemplateModal();
            });
        }
    }
}