import express from 'express'
import fileUpload from 'express-fileupload'

const app = express()
const port = 3000

const website = 'http://localhost:3000'
//carpeta publica jewel/images tanto para windows como para linux
app.use(express.static(path.join(__dirname, 'public')))

// Configuración de express-fileupload
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB (en bytes)
  })
)

// Ruta GET que devuelve el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// Ruta POST para recibir la información del formulario
app.post('/upload', (req, res) => {
  try {
    console.log('req.body', req.body)
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No se seleccionó ninguna imagen.')
    }
    // obtener el id en body
    const id = req.body.id

    // Imagen en files
    console.log(req.files)
    const image = req.files.image
    console.log(image)

    // Validar la extensión de la imagen
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
    image.mv(path.join(carpeta, `jewel__${uniqueId}.${type}`), err => {
      if (err) {
        return res.status(500).send('Error al subir la imagen.')
      }
      res.send('Imagen cargada exitosamente.')
    })
  } catch (error) {
    console.log(error)
  }
})

//get para obtener la imagen
app.get('/jewel/images/:id?', async (req, res) => {
  const id = req.params.id
  let carpeta = path.join(__dirname, 'public/jewel/images')
  if (id) {
    carpeta = path.join(__dirname, 'public/jewel/images', id)
  }
  console.log(carpeta)
  const data = []
  fs.readdir(carpeta, function (err, archivos) {
    if (err) {
      onError(err)
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
            ? `${website}/jewel/images/${id}/${archivo}`
            : `${website}/jewel/images/${archivo}`,
          isDirectory: dataFile.isDirectory(),
          length: dataFile.size
        })
      }
    })

    res.send(data)
  })
})

// Iniciar el servidor
app.listen(port, () => {
  console.clear()
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
