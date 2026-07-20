/**
 * Google Apps Script - Document & Comments JSON Exporter
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * Para que este script funcione correctamente, debe habilitar los siguientes
 * Servicios Avanzados en el editor de Google Apps Script (icono de engranaje -> Servicios):
 * 
 * 1. Google Drive API (Drive) - Asegúrese de utilizar la versión v3 si se le solicita.
 */

/**
 * Crea el menú en la interfaz de usuario de Google Docs al abrir el documento.
 * Soporta tanto el menú de complementos como el menú principal para mayor facilidad de uso.
 */
function onOpen(e) {
  var ui = DocumentApp.getUi();
  
  // Agregar al menú de complementos
  ui.createAddonMenu()
    .addItem('Exportar a JSON...', 'showExportDialog')
    .addToUi();
    
  // Agregar al menú principal del documento (para desarrollo o uso directo)
  ui.createMenu('Exportador de Documento')
    .addItem('Exportar a JSON...', 'showExportDialog')
    .addToUi();
}

/**
 * Muestra el diálogo modal con la interfaz de usuario para la descarga.
 */
function showExportDialog() {
  var html = HtmlService.createHtmlOutputFromFile('download')
      .setWidth(450)
      .setHeight(330)
      .setTitle('Exportar Documento a JSON');
  DocumentApp.getUi().showModalDialog(html, 'Exportar Documento a JSON');
}

/**
 * Obtiene el contenido estructurado de Google Docs y todos sus comentarios.
 * Combina ambos recursos en un solo objeto JSON unificado en formato de cadena.
 * Soporta exportación completa o reducida según el parámetro suministrado.
 * 
 * @param {boolean} reduced Si es verdadero, realiza una exportación reducida omitiendo metadatos y usando Docs API.
 * @return {string} Cadena JSON con el contenido y los comentarios del documento.
 */
function getExportData(reduced) {
  reduced = !!reduced;
  
  if (typeof Drive === 'undefined') {
    throw new Error("El servicio avanzado 'Google Drive API' no está habilitado en su proyecto de Google Apps Script. Por favor, actívelo en la configuración del proyecto (Servicios).");
  }
  
  if (typeof Docs === 'undefined') {
    throw new Error("El servicio avanzado 'Google Docs API' no está habilitado en su proyecto de Google Apps Script. Por favor, actívelo en la configuración del proyecto (Servicios) y asegúrese de que esté agregado como 'Docs'.");
  }

  try {
    var doc = DocumentApp.getActiveDocument();
    var docId = doc.getId();
    var docTitle = doc.getName();
    
    var docContent = {};
    
    // Extracción optimizada usando Google Docs API v1 (Servicio Avanzado Docs)
    var docData = Docs.Documents.get(docId);
    
    var embeddedObjects = [];
    function addEmbeddedObject(objectId, embeddedObj) {
      if (embeddedObj && embeddedObj.imageProperties) {
        embeddedObjects.push({
          objectId: objectId,
          title: embeddedObj.title || '',
          description: embeddedObj.description || '',
          contentUri: embeddedObj.imageProperties.contentUri || null,
          sourceUri: embeddedObj.imageProperties.sourceUri || null
        });
      }
    }
    
    if (docData.inlineObjects) {
      for (var objectId in docData.inlineObjects) {
        var inlineObj = docData.inlineObjects[objectId];
        var embeddedObj = inlineObj.inlineObjectProperties && inlineObj.inlineObjectProperties.embeddedObject;
        addEmbeddedObject(objectId, embeddedObj);
      }
    }
    
    if (docData.positionedObjects) {
      for (var objectId in docData.positionedObjects) {
        var positionedObj = docData.positionedObjects[objectId];
        var embeddedObj = positionedObj.positionedObjectProperties && positionedObj.positionedObjectProperties.embeddedObject;
        addEmbeddedObject(objectId, embeddedObj);
      }
    }

    if (reduced) {
      // Función auxiliar para extraer texto plano recursivamente
      function extractTextFromElements(elements) {
        var text = '';
        if (!elements) return text;
        elements.forEach(function(element) {
          if (element.paragraph) {
            if (element.paragraph.elements) {
              element.paragraph.elements.forEach(function(el) {
                if (el.textRun && el.textRun.content) {
                  text += el.textRun.content;
                }
              });
            }
          } else if (element.table) {
            if (element.table.tableRows) {
              element.table.tableRows.forEach(function(row) {
                if (row.tableCells) {
                  row.tableCells.forEach(function(cell) {
                    text += extractTextFromElements(cell.content);
                  });
                }
              });
            }
          } else if (element.tableOfContents) {
            text += extractTextFromElements(element.tableOfContents.content);
          }
        });
        return text;
      }
      
      var bodyText = extractTextFromElements(docData.body.content);
      
      var footnotesTextArray = [];
      if (docData.footnotes) {
        for (var footnoteId in docData.footnotes) {
          var footnote = docData.footnotes[footnoteId];
          var fnText = extractTextFromElements(footnote.content);
          footnotesTextArray.push(fnText);
        }
      }
      
      docContent = {
        body: bodyText,
        footnotes: footnotesTextArray,
        embeddedObjects: embeddedObjects
      };
      
    } else {
      // Exportación completa con formato enriquecido usando Docs API
      docContent = {
        body: docData.body,
        headers: docData.headers || null,
        footers: docData.footers || null,
        footnotes: docData.footnotes || null,
        embeddedObjects: embeddedObjects
      };
    }
    
    // 2. Obtener los comentarios del documento usando la API de Google Drive v3
    var comments = [];
    var pageToken = null;
    
    do {
      var optionalArgs = {
        fields: 'nextPageToken, comments(id, kind, createdTime, modifiedTime, author(displayName, emailAddress, photoLink, me, permissionId), content, htmlContent, anchor, deleted, resolved, assigneeEmailAddress, mentionedEmailAddresses, quotedFileContent(mimeType, value), replies(id, kind, createdTime, modifiedTime, action, author(displayName, emailAddress, photoLink, me, permissionId), deleted, htmlContent, content, assigneeEmailAddress, mentionedEmailAddresses))',
        pageSize: 100
      };
      
      if (pageToken) {
        optionalArgs.pageToken = pageToken;
      }
      
      var response = Drive.Comments.list(docId, optionalArgs);
      
      if (response.comments) {
        for (var i = 0; i < response.comments.length; i++) {
          var comment = response.comments[i];
          
          // Excluir comentarios eliminados
          if (comment.deleted) {
            continue;
          }
          
          // Filtrar respuestas eliminadas dentro de los comentarios activos
          if (comment.replies) {
            comment.replies = comment.replies.filter(function(reply) {
              return !reply.deleted;
            });
            
            // Inyectar parentId a cada respuesta
            comment.replies.forEach(function(reply) {
              reply.parentId = comment.id;
            });
          }
          
          if (reduced) {
            // Eliminar la propiedad photoLink de los autores
            if (comment.author) {
              delete comment.author.photoLink;
            }
            if (comment.replies) {
              comment.replies.forEach(function(reply) {
                if (reply.author) {
                  delete reply.author.photoLink;
                }
              });
            }
          }
          
          comments.push(comment);
        }
      }
      
      pageToken = response.nextPageToken;
    } while (pageToken);
    
    // 3. Consolidar el resultado unificado
    var exportResult = {
      documentTitle: docTitle,
      exportTime: new Date().toISOString(),
      document: docContent,
      comments: comments
    };
    
    return JSON.stringify(exportResult, null, 2);
    
  } catch (error) {
    throw new Error('Error durante el proceso de exportación: ' + error.message);
  }
}
