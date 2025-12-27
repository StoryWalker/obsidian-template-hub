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
            cls: 'th-icon-preview',
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
        const mosaicContainer = containerEl.createDiv({ cls: 'th-icon-mosaic' });
        COMMON_ICONS.forEach(iconId => {
            const iconEl = mosaicContainer.createDiv({
                cls: 'th-icon-mosaic-item',
                attr: { 'aria-label': iconId }
            });
            setIcon(iconEl, iconId);
            
            iconEl.onClickEvent(async () => {
                this.plugin.settings.ribbonIcon = iconId;
                await this.plugin.saveSettings();
                this.plugin.updateRibbonIcon();
                setIcon(iconPreview, iconId); // Update the main preview
                new Notice(`Icon set to '${iconId}'`);
            });
        });
        
        // --- Dynamic Variables Documentation ---
        containerEl.createEl('h3', { text: 'Dynamic Template Variables' });
        const docEl = containerEl.createDiv({ cls: 'setting-item-description' });
        docEl.createEl('p', { text: 'You can use the following variables in your templates. They will be replaced with their dynamic values when you insert a template:' });

        const varList = docEl.createEl('ul');
        varList.createEl('li').innerHTML = '<strong>{{title}}</strong>: The title of the current note (the file name without the extension).';
        varList.createEl('li').innerHTML = '<strong>{{date}}</strong>: The current date in YYYY-MM-DD format.';
        varList.createEl('li').innerHTML = '<strong>{{time}}</strong>: The current time in HH:mm format.';
        varList.createEl('li').innerHTML = '<strong>{{folder}}</strong>: The path of the folder containing the current note.';
        
        const customDateLi = varList.createEl('li');
        customDateLi.innerHTML = '<strong>{{date:FORMAT}}</strong>: The current date and time with a custom format.';
        const customDateDesc = customDateLi.createEl('ul');
        const customDateDescLi = customDateDesc.createEl('li');
        customDateDescLi.innerHTML = 'Example: `{{date:dddd, MMMM Do YYYY}}` becomes `Wednesday, December 24th 2025`.';
        const customDateDescLi2 = customDateDesc.createEl('li');
        customDateDescLi2.innerHTML = 'The formatting is based on <a href="https://momentjs.com/docs/#/displaying/format/">Moment.js</a>.';

        // --- Advanced Scripting Documentation ---
        containerEl.createEl('h3', { text: 'Advanced Scripting' });
        const advancedDocEl = containerEl.createDiv({ cls: 'setting-item-description' });
        const warningEl = advancedDocEl.createEl('p');
        warningEl.innerHTML = '<strong>Warning:</strong> Advanced scripting provides powerful access to the Obsidian API. Use scripts from trusted sources only, as malicious code could lead to data loss.';

        const evalList = advancedDocEl.createEl('ul');
        const evalLi = evalList.createEl('li');
        evalLi.innerHTML = '<strong>{{eval:CODE}}</strong>: Executes JavaScript code.';
        
        const evalDesc = evalLi.createEl('ul');
        evalDesc.createEl('li').innerHTML = 'The code has access to the Obsidian `app` object, the `moment` library, and the current `file` object.';
        
        const apiLinks = evalDesc.createEl('li');
        apiLinks.innerHTML = 'Explore the possibilities in the <a href="https://docs.obsidian.md/Home">Official Obsidian Developer Docs</a> or the <a href="https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts">API Reference</a>.';
        
        const detailsList = apiLinks.createEl('ul');
        detailsList.createEl('li').innerHTML = '<strong>app</strong>: The entry point to the entire Obsidian application (vault, workspace, metadata, etc.).';
        detailsList.createEl('li').innerHTML = '<strong>file</strong>: A `TFile` object representing the active note (name, path, stats).';

        evalDesc.createEl('li').innerHTML = 'The code must return a string or a value that can be converted to a string.';
        
        const evalExample = evalDesc.createEl('li', { cls: 'th-code-example'});
        evalExample.innerHTML = 'Example: `{{eval: return file.stat.size; }}` returns the size of the current file in bytes.';

        // --- Shared State & Code Blocks ---
        const sharedLi = evalList.createEl('li');
        sharedLi.innerHTML = '<strong>Advanced Logic Blocks</strong>: Create complex logic with persistent variables.';
        
        const sharedDesc = sharedLi.createEl('ul');
        sharedDesc.createEl('li').innerHTML = '<strong>&lt;&lt; código &gt;&gt;</strong>: Executes logic and defines variables (produces no output).';
        sharedDesc.createEl('li').innerHTML = '<strong>&lt;&lt;: expresión &gt;&gt;</strong>: Evaluates a variable or expression and prints the result.';
        
        const sharedExample = sharedDesc.createEl('li', { cls: 'th-code-example'});
        sharedExample.innerHTML = '<strong>Example:</strong><br>' +
            '&lt;&lt;<br>' + 
            '  user = "StoryWalker";<br>' +
            '  limit = 1000;<br>' +
            '  status = file.stat.size > limit ? "Big" : "Small";<br>' +
            '&gt;&gt;<br>' +
            'The file is &lt;&lt;: status &gt;&gt; and owned by &lt;&lt;: user &gt;&gt;.';

        // --- System Functions ---
        const systemLi = evalList.createEl('li');
        systemLi.innerHTML = '<strong>System Functions</strong>: Special functions to interact with Obsidian.';
        
        const systemDesc = systemLi.createEl('ul');
        const renameLi = systemDesc.createEl('li');
        renameLi.innerHTML = '<strong>renameFile(newName)</strong>: Renames the current file to `newName`.';
        const renameDetails = renameLi.createEl('ul');
        renameDetails.createEl('li').innerHTML = 'Internal links to this file will be automatically updated by Obsidian.';
        renameDetails.createEl('li').innerHTML = 'Do not include the `.md` extension in the name.';
        
        const renameExample = renameDetails.createEl('li', { cls: 'th-code-example'});
        renameExample.innerHTML = '<strong>Example:</strong> `&lt;&lt; renameFile("Note - " + moment().format("YYYY-MM-DD")); &gt;&gt;`';

        const moveLi = systemDesc.createEl('li');
        moveLi.innerHTML = '<strong>moveFile(folderPath)</strong>: Moves the current file to `folderPath`.';
        const moveDetails = moveLi.createEl('ul');
        moveDetails.createEl('li').innerHTML = 'If the folder does not exist, it will be created automatically.';
        moveDetails.createEl('li').innerHTML = 'Example: `&lt;&lt; moveFile("Projects/Archive"); &gt;&gt;`';
	}
}
