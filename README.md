# gdocs2json

[English Version](#english) | [Versión en Español](#español)

---

<a name="english"></a>
## English

### Overview
`gdocs2json` is a Google Apps Script add-on that extracts the entire content of a Google Doc along with its comments into a unified, structured JSON file. It features a premium, glassmorphic dark-themed user interface to trigger the download directly from Google Docs.

### Features
- **Complete Export**: Exports the full structured body, headers, footers, footnotes, and embedded objects (images) metadata.
- **Reduced Export**: Exports a simplified version containing plaintext body, plaintext footnotes, and embedded objects metadata.
- **Comment Extraction**: Retrieves active comments and their replies (excluding deleted ones) using the Google Drive API v3.
- **Modern UI**: An aesthetic glassmorphic dark-mode modal dialog embedded directly into Google Docs.
- **Deployment Tools**: Includes a Python helper script to automatically generate standard icons for Google Workspace Marketplace publishing.

### Project Structure
- [Code.gs](file:///c:/Users/jgjua/Documents/repos/gdocs2json/Code.gs): Core Google Apps Script handling document traversal, comment list retrieval, UI creation, and server-side logic.
- [download.html](file:///c:/Users/jgjua/Documents/repos/gdocs2json/download.html): The HTML/JS client side for the user dialog with a modern dark theme and dynamic download triggers.
- [appsscript.json](file:///c:/Users/jgjua/Documents/repos/gdocs2json/appsscript.json): Manifest file defining the scopes, advanced services (Drive API, Docs API), and addon configuration.
- [resize_icons.py](file:///c:/Users/jgjua/Documents/repos/gdocs2json/resize_icons.py): Python utility to resize a base icon into mandatory dimensions (`32x32`, `128x128`, `220x140`) for publishing.
- [INSTRUCCIONES.md](file:///c:/Users/jgjua/Documents/repos/gdocs2json/INSTRUCCIONES.md): Step-by-step setup guide (in Spanish) for personal container-bound scripts or domain-wide deployments.

### Quick Start
To set up this addon:
1. Open your Google Doc.
2. Go to **Extensions** > **Apps Script**.
3. Replace/add files:
   - Paste the code from [Code.gs](file:///c:/Users/jgjua/Documents/repos/gdocs2json/Code.gs) into a script file.
   - Create an HTML file named `download` and paste the contents of [download.html](file:///c:/Users/jgjua/Documents/repos/gdocs2json/download.html).
   - Update [appsscript.json](file:///c:/Users/jgjua/Documents/repos/gdocs2json/appsscript.json) (ensure "Show manifest" is enabled in settings) with the contents of [appsscript.json](file:///c:/Users/jgjua/Documents/repos/gdocs2json/appsscript.json).
4. Refresh the Google Doc and look for the **Exportador de Documento** (Document Exporter) menu.

For a detailed walkthrough, including internal domain-wide publishing to Google Workspace Marketplace, see [INSTRUCCIONES.md](file:///c:/Users/jgjua/Documents/repos/gdocs2json/INSTRUCCIONES.md).

---

<a name="español"></a>
## Español

### Descripción General
`gdocs2json` es un complemento de Google Apps Script que extrae todo el contenido de un documento de Google Docs y sus comentarios en un archivo JSON estructurado y unificado. Cuenta con una interfaz de usuario en modo oscuro con diseño glassmorphic para descargar el archivo directamente desde Google Docs.

### Características
- **Exportación Completa**: Exporta la estructura completa del cuerpo, encabezados, pies de página, notas al pie y metadatos de objetos incrustados (imágenes).
- **Exportación Reducida**: Exporta una versión simplificada con texto plano del cuerpo, notas al pie y metadatos de objetos incrustados.
- **Extracción de Comentarios**: Recupera los comentarios activos y sus respuestas (excluyendo los eliminados) a través de la API de Google Drive v3.
- **Interfaz Moderna**: Diálogo modal estético en modo oscuro integrado directamente en Google Docs.
- **Herramientas de Despliegue**: Incluye un script en Python para generar automáticamente los iconos requeridos para su publicación en Google Workspace Marketplace.

### Estructura del Proyecto
- [Code.gs](file:///c:/Users/jgjua/Documents/repos/gdocs2json/Code.gs): Código principal de Google Apps Script que maneja el recorrido del documento, obtención de comentarios, creación de la interfaz y la lógica del lado del servidor.
- [download.html](file:///c:/Users/jgjua/Documents/repos/gdocs2json/download.html): Interfaz del cliente en HTML/JS con un tema oscuro moderno y controladores de descarga dinámica.
- [appsscript.json](file:///c:/Users/jgjua/Documents/repos/gdocs2json/appsscript.json): Archivo de manifiesto que define los permisos (scopes), servicios avanzados (Drive API, Docs API) y la configuración del complemento.
- [resize_icons.py](file:///c:/Users/jgjua/Documents/repos/gdocs2json/resize_icons.py): Utilidad en Python para redimensionar un icono base a las dimensiones obligatorias (`32x32`, `128x128`, `220x140`) para la publicación.
- [INSTRUCCIONES.md](file:///c:/Users/jgjua/Documents/repos/gdocs2json/INSTRUCCIONES.md): Guía de configuración paso a paso (en español) para uso personal o despliegues organizacionales.

### Inicio Rápido
Para configurar este complemento:
1. Abra su documento de Google Docs.
2. Vaya a **Extensiones** > **Apps Script**.
3. Reemplace/añada los archivos:
   - Copie el código de [Code.gs](file:///c:/Users/jgjua/Documents/repos/gdocs2json/Code.gs) en un archivo de script.
   - Cree un archivo HTML llamado `download` y copie el contenido de [download.html](file:///c:/Users/jgjua/Documents/repos/gdocs2json/download.html).
   - Actualice el archivo [appsscript.json](file:///c:/Users/jgjua/Documents/repos/gdocs2json/appsscript.json) (asegúrese de activar "Mostrar el archivo de manifiesto" en la configuración) con el contenido de [appsscript.json](file:///c:/Users/jgjua/Documents/repos/gdocs2json/appsscript.json).
4. Recargue el documento y use el menú **Exportador de Documento**.

Para una guía detallada sobre la instalación y el despliegue interno en la organización, consulte [INSTRUCCIONES.md](file:///c:/Users/jgjua/Documents/repos/gdocs2json/INSTRUCCIONES.md).
