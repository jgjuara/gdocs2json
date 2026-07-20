# Guía de Configuración e Instalación del Exportador a JSON

Este documento detalla los pasos necesarios para configurar y utilizar el complemento de exportación de documentos y comentarios de forma privada (para uso personal) o de forma interna dentro de una organización de Google Workspace.

---

## Método 1: Uso Privado / Personal (Script Contenedor)

Este método es el más rápido para usuarios individuales que desean utilizar el complemento en un documento específico sin realizar publicaciones.

### Paso 1: Abrir el Editor de Apps Script
1. Abra el documento de Google Docs donde desea utilizar el complemento.
2. En el menú superior, diríjase a **Extensiones** > **Apps Script**.

### Paso 2: Copiar los Archivos del Proyecto
1. En el editor de Apps Script, reemplace todo el contenido del archivo predeterminado `Código.gs` con el contenido del archivo `Code.gs` de este repositorio. Renombre el archivo del editor a `Code.gs` si lo desea.
2. Haga clic en el botón **+** (Agregar un archivo) junto a "Archivos" y seleccione **HTML**.
3. Nombre al nuevo archivo `download` (el editor añadirá la extensión `.html` automáticamente).
4. Reemplace todo el contenido del archivo `download.html` recién creado con el contenido del archivo `download.html` de este repositorio.
5. Diríjase a la **Configuración del proyecto** (icono de engranaje en la barra lateral izquierda) y marque la opción **Mostrar el archivo de manifiesto "appsscript.json" en el editor**.
6. Regrese a la pestaña **Editor** (icono de código `< >`), abra el archivo `appsscript.json` que ahora es visible y reemplace todo su contenido con el contenido del archivo `appsscript.json` de este repositorio.
7. Guarde el proyecto haciendo clic en el icono del disco (Guardar proyecto).

### Paso 3: Habilitar los Servicios Avanzados (Método Alternativo Manual)
> [!NOTE]
> Si en el Paso 2 copió el archivo `appsscript.json`, este paso ya se habrá configurado automáticamente con los servicios y alcances necesarios y no requiere acción manual.
> 
> Si prefiere agregarlos manualmente a través de la interfaz:
1. En la barra lateral izquierda del editor de Apps Script, haga clic en el botón **+** junto a **Servicios**.
2. En la lista de servicios:
   * Busque **Drive API** y selecciónelo. Asegúrese de que la versión sea la **v3** (si se le solicita) y que el identificador sea `Drive`. Haga clic en **Añadir**.
   * Haga clic nuevamente en **+** (Servicios), busque **Google Docs API**, verifique que el identificador sea `Docs` y haga clic en **Añadir**.

### Paso 4: Autorización y Ejecución
1. Regrese a la pestaña de su documento de Google Docs y recargue la página.
2. Aparecerá un nuevo menú en la barra superior llamado **Exportador de Documento** (o bajo **Extensiones** > **Complementos**).
3. Haga clic en **Exportador de Documento** > **Exportar a JSON...**.
4. Google solicitará autorización de seguridad:
   * Haga clic en **Continuar**.
   * Seleccione su cuenta de Google.
   * En la pantalla de advertencia "Google no ha verificado esta aplicación", haga clic en **Configuración avanzada**.
   * Haga clic en **Ir a Exportador a JSON (no seguro)**.
   * Conceda los permisos requeridos haciendo clic en **Permitir**.
5. Se abrirá la interfaz del exportador. Seleccione el método de exportación deseado para iniciar la descarga.

---

## Método 2: Despliegue Interno para una Organización (Google Workspace)

Si desea que el complemento esté disponible para múltiples usuarios de su dominio de Google Workspace sin que cada uno deba copiar el código manualmente, debe publicarlo como un complemento interno de la organización.

### Requisitos Previos
* Una cuenta de administrador o desarrollador en la consola de Google Workspace.
* Acceso a Google Cloud Console con permisos para crear proyectos en la organización.

### Paso 1: Crear un Script Independiente
1. Acceda a [script.google.com](https://script.google.com/) con su cuenta organizativa.
2. Cree un **Nuevo proyecto**.
3. Copie y configure los archivos `Code.gs`, `download.html` y el archivo de manifiesto `appsscript.json` tal como se describe en el Método 1 (habilitando la visibilidad del manifiesto).

### Paso 2: Vincular a un Proyecto de Google Cloud (GCP)
1. En el editor de Apps Script, vaya a **Configuración del proyecto** (icono de engranaje).
2. Marque la casilla **Mostrar el archivo de manifiesto "appsscript.json" en el editor**.
3. Vaya a [Google Cloud Console](https://console.cloud.google.com/).
4. Cree un nuevo proyecto de GCP específico para este complemento.
5. Copie el **Número de proyecto** (disponible en el panel de información del proyecto de GCP).
6. Regrese a la configuración del proyecto de Apps Script, haga clic en **Cambiar de proyecto** e introduzca el Número del proyecto de GCP.

### Paso 3: Configurar la Pantalla de Consentimiento OAuth
1. En Google Cloud Console, vaya a **API y servicios** > **Pantalla de consentimiento de OAuth**.
2. Seleccione **Interno** como el Tipo de usuario (User Type) para que solo las cuentas de su organización puedan acceder.
3. Complete los campos obligatorios del perfil de la aplicación.
4. En la sección **Permisos (Scopes)**, agregue manualmente los permisos requeridos por el script:
   * `https://www.googleapis.com/auth/documents.currentonly` (acceso al documento activo)
   * `https://www.googleapis.com/auth/drive.readonly` (lectura de comentarios mediante Drive API)
   * `https://www.googleapis.com/auth/documents` (si se utiliza la API de Docs avanzada)
5. Guarde y continúe.

### Paso 4: Publicar el Complemento de Editor
1. En Google Cloud Console, vaya a **API y servicios** > **Biblioteca**.
2. Busque e active la API **Google Workspace Marketplace SDK**.
3. Tras activarla, vaya a **API y servicios** > **Google Workspace Marketplace SDK** > **Configuración**.
4. Configure los parámetros de integración del complemento de editor:
   * Active la casilla **Extensiones de Google Docs**.
   * En **ID de script del proyecto**, introduzca el ID de su script de Apps Script (disponible en la configuración del proyecto de Apps Script).
   * Defina la versión de despliegue del script.
5. Vaya a la pestaña **Publicar en App Store** dentro del SDK de Marketplace:
   * Rellene la información de la ficha (nombre, descripciones, capturas de pantalla, iconos). *Nota: puede generar e importar los iconos en las medidas reglamentarias utilizando el script [resize_icons.py](file:///C:/Users/jgjua/Documents/antigravity/lucid-davinci/resize_icons.py) de este repositorio*.
   * En la sección de visibilidad, asegúrese de seleccionar **Privado (solo para usuarios del dominio)**.
   * Haga clic en **Publicar**.

### Paso 5: Instalación por parte de los Usuarios
Una vez publicado en la Workspace Marketplace de la organización:
* **Instalación Individual:** Los usuarios del dominio pueden ir a un documento de Google Docs, seleccionar **Extensiones** > **Complementos** > **Obtener complementos**, buscar la aplicación en la pestaña interna de la organización e instalarla.
* **Instalación Forzada (Consola de Administración):** El administrador de Workspace puede ingresar a la consola de administración de Google, buscar la aplicación publicada internamente y forzar la instalación a toda la organización o a unidades organizativas específicas de forma automática.
