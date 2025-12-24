import { App, SuggestModal, TFile } from "obsidian";

export class TemplateSuggestModal extends SuggestModal<TFile> {
    private onChoose: (file: TFile) => void;
    private templates: TFile[];

    constructor(app: App, templates: TFile[], onChoose: (file: TFile) => void) {
        super(app);
        this.templates = templates;
        this.onChoose = onChoose;
    }

    getSuggestions(query: string): TFile[] {
        const lowerCaseQuery = query.toLowerCase();
        return this.templates.filter(template =>
            template.name.toLowerCase().includes(lowerCaseQuery)
        );
    }

    renderSuggestion(template: TFile, el: HTMLElement): void {
        el.createEl("div", { text: template.basename });
        el.createEl("small", { text: template.path, cls: "text-muted" });
    }

    onChooseSuggestion(template: TFile): void {
        this.onChoose(template);
    }
}
