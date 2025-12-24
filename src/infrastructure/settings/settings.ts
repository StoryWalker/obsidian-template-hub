
export interface TemplateManagerSettings {
	templateFolderPath: string;
	showRibbonIcon: boolean;
	ribbonIcon: string;
}

export const DEFAULT_SETTINGS: TemplateManagerSettings = {
	templateFolderPath: 'templates',
	showRibbonIcon: true,
	ribbonIcon: 'lucide-layout-template',
}
