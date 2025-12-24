# Bitácora de Cambios

### Miércoles, 24 de diciembre de 2025

- **ACCIÓN**: Creación de la estructura de directorios de Arquitectura Limpia en `src/`.
  - Directorios creados: `application/use-cases`, `domain/entities`, `domain/repositories`, `infrastructure/logging`, `infrastructure/obsidian`, `infrastructure/settings`, `infrastructure/ui`.
- **ACCIÓN**: Movimiento de archivos existentes a su nueva ubicación.
  - Se movió `src/settings.ts` a `src/infrastructure/settings/settings.ts`.

- **FEATURE**: Implementación de la configuración de la carpeta de plantillas (HU-002).
  - **MODIFICACIÓN**: `infrastructure/settings/settings.ts` - Se actualizó la interfaz a `TemplateManagerSettings` para incluir `templateFolderPath` y se eliminó la clase de UI de ejemplo.
  - **CREACIÓN**: `infrastructure/ui/SettingTab.ts` - Se creó un nuevo archivo para albergar la clase `TemplateManagerSettingTab`, separando la UI de la definición de datos.
  - **MODIFICACIÓN**: `infrastructure/ui/SettingTab.ts` - Se corrigió la referencia de la clase del plugin a `MiPlugin` para asegurar la compatibilidad con `main.ts`.
  - **MODIFICACIÓN**: `main.ts` - Se reestructuró para implementar los métodos `loadSettings` y `saveSettings`, y para añadir y mostrar la `TemplateManagerSettingTab`.

- **REFACTOR**: Estandarización del código base a inglés (HU-003).
  - **MODIFICACIÓN**: `main.ts` - Se renombró la clase principal a `TemplateManagerPlugin`. Se tradujeron todos los identificadores, comandos, logs y notificaciones a inglés. Se eliminó el código de ejemplo (ribbon icon).
  - **MODIFICACIÓN**: `infrastructure/ui/SettingTab.ts` - Se actualizó la referencia a la clase principal para que fuera `TemplateManagerPlugin`.
  - **REVISIÓN**: `infrastructure/settings/settings.ts` - Se confirmó que el archivo ya cumplía con los estándares de nomenclatura en inglés.

- **CORRECCIÓN**: Mejoras en la configuración de plantillas (HU-004).
  - **MODIFICACIÓN**: `infrastructure/ui/SettingTab.ts` - Se reemplazó el `placeholder` con un `<datalist>` que sugiere subcarpetas del plugin de plantillas nativo. La creación de carpetas se movió del evento `onChange` a un botón explícito de "Update", para prevenir la creación accidental de carpetas.

- **FEATURE**: Icono de la barra lateral configurable (HU-005).
  - **MODIFICACIÓN**: `infrastructure/settings/settings.ts` - Se añadieron las propiedades `showRibbonIcon` y `ribbonIcon` a la configuración.
  - **CREACIÓN**: `infrastructure/ui/IconSuggestModal.ts` - Se creó una nueva ventana modal para permitir la búsqueda y selección de iconos de Obsidian.
  - **MODIFICACIÓN**: `main.ts` - Se añadió el método `updateRibbonIcon()` para gestionar la visibilidad y el icono mostrado en la barra lateral.
  - **MODIFICACIÓN**: `infrastructure/ui/SettingTab.ts` - Se añadieron nuevos controles en la configuración para activar/desactivar el icono y para abrir el modal de selección de iconos.

- **CORRECCIÓN**: Mejoras en el mosaico de iconos (HU-006).
  - **MODIFICACIÓN**: `infrastructure/ui/SettingTab.ts` - Se aumentó la lista de iconos comunes a ~100. Se aplicaron estilos de CSS directamente a los elementos del mosaico para forzar una visualización en cuadrícula y corregir el error de la columna única.
  - **REVISIÓN**: `../styles.css` - Se verificó que el archivo estaba vacío, por lo que no fue necesaria ninguna limpieza de CSS.

- **AJUSTE**: Diseño de rejilla fija para el mosaico de iconos (HU-007).
  - **MODIFICACIÓN**: `infrastructure/ui/SettingTab.ts` - Se ajustó la lista de iconos a 102. Se cambió el estilo del contenedor del mosaico de `flex` a `grid` con una plantilla de 17 columnas (`repeat(17, 1fr)`) para cumplir con la solicitud de diseño específico.

- **FEATURE**: Comando para insertar plantillas (HU-008).
  - **CREACIÓN**: `infrastructure/ui/TemplateSuggestModal.ts` - Se creó una nueva ventana modal para mostrar y seleccionar plantillas de una lista filtrada.
  - **MODIFICACIÓN**: `main.ts` - Se añadió el nuevo comando "Insert template" que utiliza el modal para permitir al usuario seleccionar un archivo de la carpeta de plantillas configurada e insertar su contenido en el editor.

- **FEATURE**: Conexión del icono de la barra con la inserción de plantillas (HU-009).
  - **REFACTOR**: `main.ts` - Se extrajo la lógica para mostrar el modal de inserción de plantillas a un método privado y reutilizable (`showInsertTemplateModal`). Tanto el comando de la paleta como el `click` del icono de la barra ahora llaman a este método, unificando la funcionalidad.
