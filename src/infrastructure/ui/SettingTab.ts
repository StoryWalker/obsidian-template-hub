import { App, PluginSettingTab, Setting, Notice, TFolder, setIcon } from "obsidian";
import TemplateManagerPlugin from "../../main";
import { IconSuggestModal } from "./IconSuggestModal";

// 17 * 6 = 102 icons
const COMMON_ICONS = [
    'lucide-layout-template', 'lucide-file-plus-2', 'lucide-folder-plus', 'lucide-file-text', 'lucide-folder', 'lucide-book', 'lucide-settings', 'lucide-home', 'lucide-star', 'lucide-zap', 'lucide-flame', 'lucide-info', 'lucide-plus', 'lucide-minus', 'lucide-x', 'lucide-check', 'lucide-search', 'lucide-trash', 'lucide-edit', 'lucide-history', 'lucide-clock', 'lucide-calendar', 'lucide-user', 'lucide-users', 'lucide-pin', 'lucide-paperclip', 'lucide-navigation', 'lucide-move', 'lucide-mouse-pointer', 'lucide-mail', 'lucide-lock', 'lucide-link', 'lucide-keyboard', 'lucide-inbox', 'lucide-image', 'lucide-git-commit', 'lucide-folder-open', 'lucide-file-cog', 'lucide-file-archive', 'lucide-external-link', 'lucide-database', 'lucide-cpu', 'lucide-compass', 'lucide-code', 'lucide-circle', 'lucide-chevron-down', 'lucide-chevron-up', 'lucide-chevron-left', 'lucide-chevron-right', 'lucide-chevrons-down-up', 'lucide-bold', 'lucide-italic', 'lucide-underline', 'lucide-highlighter', 'lucide-at-sign', 'lucide-award', 'lucide-archive', 'lucide-album', 'lucide-activity', 'lucide-airplay', 'lucide-alarm-clock', 'lucide-alert-circle', 'lucide-align-center', 'lucide-align-justify', 'lucide-align-left', 'lucide-align-right', 'lucide-anchor', 'lucide-aperture', 'lucide-arrow-down-circle', 'lucide-arrow-up-circle', 'lucide-arrow-left-circle', 'lucide-arrow-right-circle', 'lucide-asterisk', 'lucide-atom', 'lucide-battery', 'lucide-bell', 'lucide-bike', 'lucide-bluetooth', 'lucide-bookmark', 'lucide-box', 'lucide-briefcase', 'lucide-camera', 'lucide-captions', 'lucide-cast', 'lucide-clipboard', 'lucide-cloud', 'lucide-cloud-drizzle', 'lucide-cloud-lightning', 'lucide-cloud-rain', 'lucide-cloud-snow', 'lucide-codepen', 'lucide-columns', 'lucide-command', 'lucide-contact', 'lucide-copy', 'lucide-crop', 'lucide-crosshair', 'lucide-delete', 'lucide-disc'
];

export class TemplateManagerSettingTab extends PluginSettingTab {
	plugin: TemplateManagerPlugin;

	constructor(app: App, plugin: TemplateManagerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Template Manager Settings' });

        // --- General Section ---
        containerEl.createEl('h3', { text: 'General Settings' });

		// Get Core Templates Info
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const coreTemplatesConfig = (this.app as any).internalPlugins.plugins['templates']?.instance;
		const coreTemplateFolderPath = coreTemplatesConfig?.options?.folder;

		let subfolders: TFolder[] = [];
		if (coreTemplateFolderPath) {
			const allFolders = this.app.vault.getAllLoadedFiles().filter(f => f instanceof TFolder) as TFolder[];
			subfolders = allFolders.filter(f => f.path.startsWith(coreTemplateFolderPath + '/') && f.path !== coreTemplateFolderPath);
		}

		// Template folder setting
		new Setting(containerEl)
			.setName('Templates folder location')
			.setDesc("Specify the folder for your templates. Subfolders from the core templates plugin are available as suggestions.")
			.addText(text => {
				if (coreTemplateFolderPath) {
					const datalistId = `template-folder-list-${Date.now()}`;
					const datalist = containerEl.createEl('datalist', { attr: { id: datalistId } });
					datalist.createEl('option', { attr: { value: coreTemplateFolderPath } });
					subfolders.forEach(f => datalist.createEl('option', { attr: { value: f.path } }));
					text.inputEl.setAttribute('list', datalistId);
				}
                
                text.setPlaceholder(coreTemplateFolderPath || 'Example: templates/')
                    .setValue(this.plugin.settings.templateFolderPath)
                    .onChange((value) => {
                        this.plugin.settings.templateFolderPath = value;
                    });
			})
			.addButton(button => {
				button
					.setButtonText("Update")
                    .setTooltip("Saves the path and creates the folder if it doesn't exist.")
					.onClick(async () => {
                        const path = this.plugin.settings.templateFolderPath;
                        if (!path) {
                            new Notice("Folder path cannot be empty.");
                            return;
                        }
                        try {
                            const folder = this.app.vault.getAbstractFileByPath(path);
                            if (!folder) {
                                await this.app.vault.createFolder(path);
                                new Notice(`Folder created: ${path}`);
                            } else {
                                new Notice(`Folder found: ${path}`);
                            }
                            await this.plugin.saveSettings();
                        } catch (e) {
                            if (e instanceof Error) {
                                new Notice(`Error processing folder path: ${e.message}`);
                            } else {
                                new Notice('An unknown error occurred while processing the folder path.');
                            }
                        }
					});
			});

        // --- Ribbon Menu Section ---
        containerEl.createEl('h3', { text: 'Ribbon Menu' });

        new Setting(containerEl)
            .setName('Show ribbon icon')
            .setDesc('Toggle the visibility of the plugin icon in the sidebar ribbon.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showRibbonIcon)
                .onChange(async (value) => {
                    this.plugin.settings.showRibbonIcon = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateRibbonIcon();
                }));

        const iconSetting = new Setting(containerEl)
            .setName('Ribbon icon')
            .setDesc('Change the icon used for the ribbon menu. Select from common icons below or search all.');
        
        const iconPreview = iconSetting.controlEl.createDiv({
            cls: 'tm-icon-preview',
            attr: { style: 'margin-right: 10px;'}
        });
        setIcon(iconPreview, this.plugin.settings.ribbonIcon);
        
        iconSetting.addButton(button => button
            .setButtonText('Search All...')
            .onClick(() => {
                new IconSuggestModal(this.app, async (iconId) => {
                    this.plugin.settings.ribbonIcon = iconId;
                    await this.plugin.saveSettings();
                    this.plugin.updateRibbonIcon();
                    setIcon(iconPreview, iconId); // Update preview immediately
                }).open();
            }));
        
        // --- Icon Mosaic ---
        const mosaicContainer = containerEl.createDiv();
        // Apply styles directly to ensure grid layout
        mosaicContainer.style.display = 'grid';
        mosaicContainer.style.gridTemplateColumns = 'repeat(17, 1fr)';
        mosaicContainer.style.gap = '8px';
        mosaicContainer.style.paddingLeft = '48px'; // Align with setting controls
        mosaicContainer.style.marginBottom = '20px';

        COMMON_ICONS.forEach(iconId => {
            const iconEl = mosaicContainer.createDiv();
            // Style the mosaic item
            iconEl.style.cursor = 'pointer';
            iconEl.style.padding = '6px';
            iconEl.style.borderRadius = '5px';
            iconEl.style.border = '1px solid var(--background-modifier-border)';
            iconEl.style.textAlign = 'center';

            iconEl.setAttribute('aria-label', iconId);
            setIcon(iconEl, iconId);

            iconEl.addEventListener('mouseenter', () => {
                iconEl.style.backgroundColor = 'var(--background-modifier-hover)';
            });
            iconEl.addEventListener('mouseleave', () => {
                iconEl.style.backgroundColor = 'transparent';
            });
            
            iconEl.onClickEvent(async () => {
                this.plugin.settings.ribbonIcon = iconId;
                await this.plugin.saveSettings();
                this.plugin.updateRibbonIcon();
                setIcon(iconPreview, iconId); // Update the main preview
                new Notice(`Icon set to '${iconId}'`);
            });
        });
	}
}
