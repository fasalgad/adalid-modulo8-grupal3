import fs from 'node:fs'
const __dirname = process.cwd()
import path from 'path'
import { SITE } from '../config/config.api.js'
import { addHATEOAS } from '../config/libs.js'

//uploadImgJoyas con  fileUpload
export const uploadImgJoyas = (req, res) => {
  try {
    console.log('uploadImgJoyas')
    const { id } = req.params
    fs.readFile(`${__dirname}/db/joyas.json`, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }
      const joyasParse = JSON.parse(data)
      const joya = joyasParse.find(e => e.id === parseInt(id))
      if (!joya) {
        return res.status(404).json({
          message: 'Joya no encontrada',
          response: null,
          err: true
        })
      }
      console.log(req.files)
      const image = req.files.image
      const joyaIndex = joyasParse.findIndex(e => e.id === parseInt(id))
      const validExtensions = ['.png']
      const ext = path.extname(image.name)
      if (!validExtensions.includes(ext)) {
        return res.status(400).send('Extensión de archivo no permitida.')
      }
      //Sino existe carpeta uploads, la crea  en la carpeta publica
      const carpeta = path.join(__dirname, 'public/jewel/images', id)
      if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta)
      }

      const type = image.mimetype.split('/')[1]
      //Id unico numerico  para la imagen
      const uniqueId = Date.now()
      // Mover la imagen a la carpeta de uploads
      const imgNewName = `jewel_${uniqueId}.${type}`
      image.mv(path.join(carpeta, imgNewName), err => {
        if (err) {
          return res.status(500).send('Error al subir la imagen.')
        } 
      })

      joyasParse[joyaIndex].img = `${SITE}/jewel/images/${id}/${imgNewName}`
      fs.writeFile(
        `${__dirname}/db/joyas.json`,
        JSON.stringify(joyasParse),
        err => {
          if (err) {
            return res.status(500).json({
              message: 'Error al guardar la joya',
              response: null,
              err: true
            })
          }
          return res.status(200).json({
            message: 'Imagen guardada con éxito',
            response: addHATEOAS([joyasParse[joyaIndex]]),
            err: false
          })
        }
      )
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}

export const updateImgJoyas = (req, res) => {
  try { 
    const { id } = req.params
    fs.readFile(`${__dirname}/db/joyas.json`, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }
      const joyasParse = JSON.parse(data)
      const joya = joyasParse.find(e => e.id === parseInt(id))
      if (!joya) {
        return res.status(404).json({
          message: 'Joya no encontrada',
          response: null,
          err: true
        })
      }  
      const image = req.files.image
      const joyaIndex = joyasParse.findIndex(e => e.id === parseInt(id))
      const validExtensions = ['.png']
      const ext = path.extname(image.name)
      if (!validExtensions.includes(ext)) {
        return res.status(400).send('Extensión de archivo no permitida.')
      }
      //Sino existe carpeta uploads, la crea  en la carpeta publica
      const carpeta = path.join(__dirname, 'public/jewel/images', id)
      if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta)
      }

      const type = image.mimetype.split('/')[1]
      //Id unico numerico  para la imagen
      const uniqueId = Date.now()
      // Mover la imagen a la carpeta de uploads
      const imgNewName = `jewel_${uniqueId}.${type}`
      image.mv(path.join(carpeta, imgNewName), err => {
        if (err) {
          return res.status(500).send('Error al subir la imagen.')
        }
      })

      joyasParse[joyaIndex].img = `${SITE}/jewel/images/${id}/${imgNewName}`
      fs.writeFile(
        `${__dirname}/db/joyas.json`,
        JSON.stringify(joyasParse),
        err => {
          if (err) {
            return res.status(500).json({
              message: 'Error al guardar la joya',
              response: null,
              err: true
            })
          }
          return res.status(200).json({
            message: 'Imagen actualizada con éxito',
            response: addHATEOAS([joyasParse[joyaIndex]]),
            err: false
          })
        }
      )
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}
 

export const getImages = async (req, res) => {
  const id = req.params.id
  let carpeta = path.join(__dirname, 'public/jewel/images')
  if (id) {
    carpeta = path.join(__dirname, 'public/jewel/images', id)
  }
  const name = req.params.name
  if (name) {
    carpeta = path.join(__dirname, 'public/jewel/images', id, name)
    res.sendFile(carpeta)
  }

  const data = []
  fs.readdir(carpeta, function (err, archivos) {
    if (err) {
      console.log(err)
      return
    }
    archivos.forEach(function (archivo) {
      const file = path.join(carpeta, archivo)
      var dataFile = null
      try {
        dataFile = fs.lstatSync(file)
      } catch (e) {}
      if (dataFile) {
        data.push({
          path: id
            ? `${SITE}/jewel/images/${id}/${archivo}`
            : `${SITE}/jewel/images/${archivo}`,
          isDirectory: dataFile.isDirectory(),
          length: dataFile.size
        })
      }
    })

    res.send(data)
  })
}
