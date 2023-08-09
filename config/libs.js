import { SITE } from './config.api.js'

export const addHATEOAS = joyas => {
  joyas.map(joya => {
    joya.actions = [
      {
        rel: 'self',
        herf: `${SITE}/joyas/${joya.id}`,
        method: 'GET'
      },
      {
        rel: 'agregar',
        href: `${SITE}/joyas`,
        method: 'POST'
      },
      {
        rel: 'actualizar',
        href: `${SITE}/joyas/${joya.id}`,
        method: 'PUT'
      },
      {
        rel: 'eliminar',
        href: `${SITE}/joyas/${joya.id}`,
        method: 'DELETE'
      }
    ]
    joya.filters = {
      filtroMaterial: `${SITE}/joyas/material/${joya.material}`,
      filtroNombreAsc: `${SITE}/joyas/nombre/${encodeURIComponent(
        joya.nombre
      )}/asc`,
      filtroNombreDesc: `${SITE}/joyas/nombre/${encodeURIComponent(
        joya.nombre
      )}/desc`
    }

    joya.images = {
      folderImgHistory: `${SITE}/jewel/images/${joya.id}`
    }
    if (joya.img) {
      joya.images['updateImg'] = {
        rel: 'actualizar imagen',
        href: `${SITE}/jewel/images/upload/${joya.id}`,
        method: 'PUT'
      }
    } else {
      joya.images['addImg'] = {
        rel: 'agregar imagen',
        href: `${SITE}/jewel/images/upload/${joya.id}`,
        method: 'POST'
      }
    }
  })
  return joyas
}
