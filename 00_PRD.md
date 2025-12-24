Documento de Especificación: Obsidian Plugin Framework
1. Visión General
Este proyecto consiste en el desarrollo de un plugin para Obsidian.md utilizando TypeScript y siguiendo los principios de Arquitectura Limpia (Clean Architecture). El objetivo es crear una herramienta mantenible, testable y escalable que separe la lógica de negocio de las APIs específicas de Obsidian.

2. Arquitectura del Sistema
El proyecto se organiza en capas concéntricas para garantizar el desacoplamiento:
- Capa de Dominio (Domain): Contendrá las entidades de negocio e interfaces (contratos). No tiene dependencias externas.
- Capa de Aplicación (Application): Implementará los casos de uso del plugin (ej. procesar texto, gestionar notas). Orquesta el flujo de datos.
- Capa de Infraestructura (Infrastructure):
    - Adaptadores de Obsidian: Implementaciones concretas de las interfaces de dominio usando la API de Obsidian (app.vault, app.workspace).
    - UI: Vistas y modales.
    - Logger: Servicio de gestión de logs y errores.

3. Estándares Técnicos
- Lenguaje: TypeScript.
- Bundler: esbuild (configurado por la plantilla oficial).
    - Gestión de Versiones:Código: Git para control de versiones.
    - Plugin: Seguimiento de SemVer ($MAJOR.MINOR.PATCH$) en manifest.json.
- Logging y Errores:
    - Nivel de Desarrollo: console.debug, console.warn.
    - Nivel de Producción: Captura de excepciones con Notice para el usuario y volcado opcional a un archivo logs.md en la carpeta de configuración del plugin.

4. Estructura de Directorios
src/
├── main.ts                 # Composition Root (Capa de Infraestructura/Entrada)
├── domain/                 # Reglas de Negocio Puras (Entidades, Interfaces)
│   ├── entities/           # Ej: MiNota.ts, Recordatorio.ts
│   └── repositories/       # Definición de interfaces (ej: IFileRepository)
├── application/            # Casos de Uso (Orquestación)
│   └── use-cases/          # Ej: CrearNotaZettelkasten.ts, FormatearTexto.ts
└── infrastructure/         # Implementaciones Técnicas (Detalles)
    ├── obsidian/           # Implementación de Repositorios usando la API de Obsidian
    ├── logging/            # Servicio de logs y persistencia de errores
    ├── ui/                 # Vistas, Modales, Ribbons (React/Svelte o Vanilla)
    └── settings/           # Persistencia de configuración

5. Guía de Continuidad para IA
Para continuar el desarrollo, la IA debe:
- Respetar la Inyección de Dependencias en el main.ts.
- Asegurarse de que cualquier funcionalidad nueva comience con una interfaz en domain/.
- No importar el módulo obsidian fuera de la capa de infrastructure/.
- Mantener el manifest.json actualizado con la versión correspondiente.Ahora si crearemos el pli