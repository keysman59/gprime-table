async function getAdminLayerSetting (layerId) {

  let obj = {
    "id": "2bd50162-47f0-45b6-9546-7c4edb4e0d16",
    "layerSetting": {
        "id": 1772,
        "layerId": "2bd50162-47f0-45b6-9546-7c4edb4e0d16",
        "created": "2021-05-21T14:51:23.849Z",
        "updated": "2021-06-16T11:33:18.066Z",
        "settings": {
            "id": 1772,
            "aliases": {
                "id": "Идентификатор",
                "status": "Статус",
                "document_type": "Вид документа",
                "cancellation_reason": "Основание для отмены действия",
                "doc_name": "Наименование документа",
                "document_relevancy": "Тип документа",
                "changing_document": "Во изменение документа",
                "main_document": "Основной документ",
                "isogd_service": "Служба ИСОГД",
                "territory": "Территория",
                "cadastral_number": "Кадастровый номер",
                "territory_description": "Описание территории",
                "registration_number": "Регистрационный номер в ГИСОГД",
                "registration_date": "Дата регистрации",
                "data_placement_organ": "Уполномоченный орган, разместивший данные",
                "sender": "Отправитель",
                "outgoing_number": "Исх.номер",
                "sending_date": "Дата отправки",
                "incoming_number": "Вх.номер",
                "receiving_date": "Дата поступления",
                "customer_name": "Заказчик",
                "develop_reason": "Основание для разработки",
                "approved_by": "Кем утвержден",
                "approval_document": "Вид утверждающего документа",
                "approval_document_number": "№ утверждающего документа",
                "approval_document_date": "Дата утверждающего документа",
                "developer": "Разработчик",
                "development_year": "Год разработки",
                "registered_by": "Зарегистрировал",
                "registration_status": "Статус регистрации документа ГД",
                "changing_doc_cancel_reason": "Основание для отмены действия изменяемого документа",
                "original_storage_placement": "Место хранения оригинала",
                "refusal_reasons": "Основания для отказа в регистрации",
                "oktmo_id": "ОКТМО пользователя, создавшего запись",
                "created_by": "Служ. Кем создан",
                "created": "Служ. Дата создания",
                "updated_by": "Служ. Кем изменен",
                "updated": "Служ. Дата изменения",
                "deleted_by": "Служ. Кем удален",
                "deleted": "Служ. Дата удаления",
                "objectid": "Сист.ид_арм",
                "document_type_id": "document_type_id",
                "territory_id": "territory_id",
                "object_name": "Наименование",
                "document_number": "Номер документа"
            },
            "allowedAttributes": ["document_type", "document_relevancy", "isogd_service", "territory"],
            "attributesForShowing": ["status", "document_type", "doc_name", "changing_document", "isogd_service", "territory", "cadastral_number", "territory_description", "registration_number", "registration_date", "data_placement_organ", "customer_name", "develop_reason", "approved_by", "approval_document", "approval_document_number", "approval_document_date", "developer", "development_year", "document_number"],
            "clustering": {
                "enabled": false,
                "distance": null,
                "resolution": null,
                "coverage": false,
                "sld": null
            },
            "displayName": "object_name",
            "filePlace": "8",
            "hideEmpty": true,
            "keyField": "id",
            "layerField": "id",
            "mapIdField": "id",
            "types": {
                "id": "string",
                "status": "string",
                "document_type": "string",
                "cancellation_reason": "string",
                "doc_name": "string",
                "document_relevancy": "string",
                "changing_document": "string",
                "main_document": "string",
                "isogd_service": "string",
                "territory": "string",
                "cadastral_number": "string",
                "territory_description": "string",
                "registration_number": "string",
                "registration_date": "date",
                "data_placement_organ": "string",
                "sender": "string",
                "outgoing_number": "string",
                "sending_date": "date",
                "incoming_number": "string",
                "receiving_date": "date",
                "customer_name": "string",
                "develop_reason": "string",
                "approved_by": "string",
                "approval_document": "string",
                "approval_document_number": "string",
                "approval_document_date": "date",
                "developer": "string",
                "development_year": "int",
                "registered_by": "string",
                "registration_status": "string",
                "changing_doc_cancel_reason": "string",
                "original_storage_placement": "string",
                "refusal_reasons": "string",
                "oktmo_id": "string",
                "created_by": "string",
                "created": "date-time",
                "updated_by": "string",
                "updated": "date-time",
                "deleted_by": "string",
                "deleted": "date-time",
                "objectid": "int",
                "document_type_id": "string",
                "territory_id": "string",
                "object_name": "string",
                "document_number": "string"
            },
            "connectedLayers": [],
            "imageId": "1a9cfbc4-c902-4e83-8f32-704b0e27624f"
        },
        "layer_id": "2bd50162-47f0-45b6-9546-7c4edb4e0d16"
    },
    "name": "Зоны действия документов",
    "type": 10,
    "layers": "fpd:l_isogd_documents_without_inzh",
    "url": "http://gisfpd.petrosoft.su/geoserver/ows",
    "authorizationString": "",
    "style": {},
    "cqlFilter": null,
    "opacity": 100
}




  return obj
}

async function zoomAndHighlightObjectsOnMap (items, map, maxZoomToPoints) {
  if (!items || items.length === 0) {
    return
  }
  console.log(maxZoomToPoints)
  var geometries = []
  for (let item of items) {
    try {
      const convertedGeometry = await getItemGeometry(item)
      if (convertedGeometry) {
        geometries.push(convertedGeometry)
      }
    } catch (error) {
      console.warn('не удалось преобразовать геометрию объекта')
    }
  }

  if (!geometries || geometries.length === 0) {
    return
  }

  // var extent = getGeometriesExtent(geometries)

  // zoomToGeometryOrExtentOnMap(extent, map, maxZoomToPoints)
  await highlightGeometriesOnMap(geometries, map)
}

async function zoomToGeometryOrExtentOnMap (geometryOrExtent, map, maxZoomToPoints) {
  let padding = [0, 0, 0, 0]

  if (document.documentElement.clientWidth > 768) {
    var sideBarMini = document.getElementsByClassName('sidenav-mini')[0]
    var pane = document.getElementsByClassName('pane')[0]
    var layerObject = document.getElementsByClassName('layer-object')[0]
    if (sideBarMini) {
      padding[3] = padding[3] + sideBarMini.clientWidth
    }
    if (pane) {
      padding[3] = padding[3] + pane.clientWidth
    }
    if (layerObject) {
      padding[2] = layerObject.clientHeight
    }
  }

  let maxZoom = 17
  if (geometryOrExtent[0] === geometryOrExtent[2] && geometryOrExtent[1] === geometryOrExtent[3] && maxZoomToPoints) {
    maxZoom = maxZoomToPoints
  }
  map.getView().fit(geometryOrExtent, { maxZoom: maxZoom, padding: padding })
}



export { getAdminLayerSetting }
