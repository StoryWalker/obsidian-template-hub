import { App, SuggestModal, getIconIds } from "obsidian";

export class IconSuggestModal extends SuggestModal<string> {
    private onChoose: (iconId: string) => void;
    private allIcons: string[];

    constructor(app: App, onChoose: (iconId: string) => void) {
        super(app);
        this.onChoose = onChoose;
        this.allIcons = getIconIds();
    }

    getSuggestions(query: string): string[] {
        const lowerCaseQuery = query.toLowerCase();
        return this.allIcons.filter(iconId =>
            iconId.toLowerCase().includes(lowerCaseQuery)
        );
    }

    renderSuggestion(iconId: string, el: HTMLElement): void {
        el.createDiv({ text: iconId });
    }

    onChooseSuggestion(iconId: string): void {
        this.onChoose(iconId);
    }
}
