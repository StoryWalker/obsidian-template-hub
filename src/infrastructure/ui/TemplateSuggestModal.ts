import { App, SuggestModal, TFile, TFolder, TAbstractFile } from "obsidian";

export interface SelectionResult {
    file: TFile;
    project: string;
    type: string;
}

export class TemplateSuggestModal extends SuggestModal<TAbstractFile> {
    private onChoose: (result: SelectionResult) => void;
    private items: TAbstractFile[];
    private baseFolder: string;
    private currentProject: string = "";

    constructor(app: App, baseFolder: string, items: TAbstractFile[], onChoose: (result: SelectionResult) => void, project: string = "") {
        super(app);
        this.items = items;
        this.onChoose = onChoose;
        this.baseFolder = baseFolder;
        this.currentProject = project;
        
        // Dynamic title based on selection stage
        this.setPlaceholder(project ? `Select type for project: ${project}` : "Select a project or template...");
    }

    getSuggestions(query: string): TAbstractFile[] {
        const lowerCaseQuery = query.toLowerCase();
        return this.items.filter(item =>
            item.name.toLowerCase().includes(lowerCaseQuery)
        );
    }

    renderSuggestion(item: TAbstractFile, el: HTMLElement): void {
        const isFolder = item instanceof TFolder;
        const container = el.createDiv({ cls: "th-suggestion-item" });
        
        if (isFolder) {
            container.createEl("span", { text: "📁 " });
            container.createEl("strong", { text: item.name });
        } else {
            container.createEl("span", { text: "📄 " });
            container.createEl("span", { text: (item as TFile).basename });
        }
    }

    onChooseSuggestion(item: TAbstractFile): void {
        if (item instanceof TFolder) {
            // Drill down into project
            const subItems = item.children.filter(f => 
                (f instanceof TFile && f.extension === 'md') || f instanceof TFolder
            );
            new TemplateSuggestModal(this.app, this.baseFolder, subItems, this.onChoose, item.name).open();
        } else if (item instanceof TFile) {
            // Final selection
            this.onChoose({
                file: item,
                project: this.currentProject || "General",
                type: item.basename
            });
        }
    }
}