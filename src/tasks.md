# Historias de Usuario y Tareas

### Configuración Inicial del Proyecto

- **HU-001: Como desarrollador, quiero tener una estructura de directorios organizada según la Arquitectura Limpia para asegurar la escalabilidad y mantenibilidad del plugin.**
  - [x] Crear directorios base: `domain`, `application`, `infrastructure`.
  - [x] Crear subdirectorios para `domain`: `entities`, `repositories`.
  - [x] Crear subdirectorios para `application`: `use-cases`.
  - [x] Crear subdirectorios para `infrastructure`: `obsidian`, `logging`, `ui`, `settings`.
  - [x] Mover el archivo `settings.ts` a `infrastructure/settings`.

### Gestión de Plantillas

- **HU-002: Como usuario, quiero poder configurar una carpeta específica para mis plantillas, que sea independiente de la configuración de plantillas de Obsidian.**
  - [x] Añadir la propiedad `templateFolderPath` a la interfaz de ajustes.
  - [x] Definir un valor por defecto para `templateFolderPath`.
  - [x] Crear la clase `SettingTab` para la UI de los ajustes.
  - [x] Añadir un campo de texto en `SettingTab` para configurar la ruta de la carpeta de plantillas.
  - [x] Implementar la lógica para guardar el ajuste cuando cambie.
  - [x] Registrar la `SettingTab` en `main.ts` para que aparezca en Obsidian.

- **HU-004: As a user, I want the template folder setting to be easier to configure by suggesting paths and using an explicit update button.**
  - [x] Get all subfolders from the core templates plugin's folder path.
  - [x] Create a dropdown/suggestion list showing these subfolders when the input is focused.
  - [x] Remove the `onChange` folder creation logic.
  - [x] Add an "Update" button next to the text input.
  - [x] Implement folder creation/selection logic in the "Update" button's `onClick` handler.

- **HU-008: As a user, I want a command to insert a template into my current note, choosing only from my configured template folder.**
  - [x] Create a new "Insert Template" command.
  - [x] Create a `TemplateSuggestModal` to display available templates.
  - [x] The modal must only list `.md` files from the folder configured in the plugin's settings.
  - [x] Implement logic to read the content of the selected template.
  - [x] Implement logic to insert the template content into the active editor at the cursor position.

### User Interface & Experience

- **HU-005: As a user, I want to add a configurable icon to the sidebar ribbon to easily access the plugin's main functionality.**
  - [x] Add `showRibbonIcon` and `ribbonIcon` properties to the settings interface.
  - [x] Create an `IconSuggestModal` for searching and selecting an Obsidian icon.
  - [x] Add a setting to toggle the ribbon icon's visibility.
  - [x] Add a setting to show the current icon and a "Change" button that opens the modal.
  - [x] Implement the logic to save the selected icon.
  - [x] Create an `updateRibbonIcon` method in `main.ts` to add/remove the ribbon icon based on settings.
  - [x] Call the update method on plugin load and after settings change.

- **HU-006: As a user, I want to see a mosaic of common icons directly in the settings for quick visual selection.**
  - [x] Increase the number of curated icons to around 100.
  - [x] Apply styles directly to the mosaic elements to ensure a proper grid layout.
  - [x] Remove the now-redundant CSS from the external `styles.css` file (No action needed as file was empty).

- **HU-007: As a user, I want the icon mosaic to have a fixed grid layout of 17 columns.**
  - [x] Adjust the curated icon list to contain exactly 102 icons.
  - [x] Change the mosaic styling from `flexbox` to `CSS Grid`.
  - [x] Set `grid-template-columns` to `repeat(17, 1fr)` to enforce the column count.

- **HU-009: As a user, I want to click the sidebar ribbon icon to trigger the 'Insert Template' modal.**
  - [x] Refactor the template insertion logic into a reusable private method.
  - [x] The new method must check for an active markdown editor before proceeding.
  - [x] Update the 'Insert template' command to call the new reusable method.
  - [x] Update the ribbon icon's `onClick` callback to also call the new reusable method.

### Technical Debt & Refactoring

- **HU-003: As a developer, I want the entire codebase to be in English and professionally structured to ensure consistency and maintainability.**
  - [x] Refactor `main.ts`: rename `MiPlugin` to `TemplateManagerPlugin`, translate all identifiers and messages to English, and remove example code.
  - [x] Refactor `infrastructure/ui/SettingTab.ts`: update the plugin class reference from `MiPlugin` to `TemplateManagerPlugin`.
  - [x] Review `infrastructure/settings/settings.ts` for language and consistency.
