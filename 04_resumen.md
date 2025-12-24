# Resumen y Guía para Asistentes de IA

## 1. Propósito de este Archivo

Este documento sirve como una guía de inicio rápido para cualquier asistente de IA que continúe con el desarrollo de este plugin de Obsidian. Resume las convenciones y el flujo de trabajo establecidos para asegurar la consistencia y el seguimiento del proyecto. El objetivo es evitar tener que repetir la fase de análisis inicial del proyecto en cada sesión.

## 2. Descripción del Proyecto

- **Nombre:** Template Hub
- **Tipo:** Plugin para Obsidian.md
- **Arquitectura:** Arquitectura Limpia (Clean Architecture), como se detalla en `00_PRD.md`.
- **Tecnología:** TypeScript, esbuild, npm.

## 3. Archivos de Control y Mantenimiento

Es **mandatorio** actualizar los siguientes archivos después de cada acción de desarrollo relevante.

### `01_bitacora.md`
- **Qué es:** Un diario de desarrollo de alto nivel.
- **Cuándo actualizar:** Después de tomar decisiones arquitectónicas importantes o realizar cambios significativos en la estructura del proyecto.
- **Qué anotar:** El "porqué" detrás de la decisión. Razonamientos, alternativas consideradas y justificación del camino tomado.

### `02_tasks.md`
- **Qué es:** La lista de tareas del proyecto (roadmap).
- **Cuándo actualizar:**
    - Al definir una nueva funcionalidad o tarea (se añade a "Backlog").
    - Al empezar a trabajar en una tarea (se mueve a "In Progress").
    - Al completar una tarea (se mueve a "Done").
- **Qué anotar:** Historias de Usuario (HU) claras y concisas.

### `03_log.md`
- **Qué es:** Un registro cronológico y detallado de cada acción.
- **Cuándo actualizar:** Después de **cada** acción concreta realizada (crear un archivo, modificar una función, recibir una nueva instrucción del usuario, etc.).
- **Qué anotar:** Una entrada con fecha y hora (`YYYY-MM-DD HH:MM`) describiendo la acción específica que se acaba de realizar.

### `04_resumen.md` (Este archivo)
- **Qué es:** La guía de convenciones.
- **Cuándo actualizar:** Solo si el flujo de trabajo o las convenciones del proyecto cambian.

## 4. Flujo de Trabajo General

1.  **Recibir Tarea:** Analizar la solicitud del usuario.
2.  **Planificar:** Desglosar la tarea en pasos y, si es necesario, crear una nueva HU en `02_tasks.md`.
3.  **Ejecutar:** Realizar los cambios en el código fuente.
4.  **Documentar:**
    - Añadir una entrada en `03_log.md` con la acción realizada.
    - Si aplica, mover la tarea en `02_tasks.md`.
    - Si aplica, justificar la decisión en `01_bitacora.md`.
5.  **Confirmar:** Informar al usuario de la finalización de la tarea y de la actualización de los archivos de control.
