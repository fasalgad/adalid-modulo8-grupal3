import express from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path' 
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 

import joyasRoutes from './routes/joyas.routes.js'
import imagesRoutes from './routes/images.routes.js'

// Puerto
const PORT = 3000

// Inicializar express
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB (en bytes)
  })
)
app.use(express.static(path.join(__dirname, 'public')))
// Rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.use('/api/v1/joyas', joyasRoutes) 
app.use('/api/v1/jewel', imagesRoutes) 

// Iniciar servidor
app.listen(PORT, () => {
	console.clear()
  console.log(`Servidor en http://localhost:${PORT}`)
})
