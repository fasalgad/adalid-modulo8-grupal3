import fs from 'node:fs'
const __dirname = process.cwd()
import { addHATEOAS } from '../config/libs.js'
const removeAcents = texto => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// TODO: implementar método getJoyas
export const getJoyas = async (req, res) => {
  try {
    fs.readFile(`${__dirname}/db/joyas.json`, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }

      let joyas = JSON.parse(data)

      return res.status(200).json({
        message: 'Joyas obtenidas',
        response: addHATEOAS(joyas),
        err: false
      })
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}

// TODO: implementar método getJoyasPorId
export const getJoyasPorId = async (req, res) => {
  try {
    const { id } = req.params
    const joyaId = parseInt(id)

    fs.readFile(`${__dirname}/db/joyas.json`, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }

      let joyas = JSON.parse(data)

      const joya = joyas.find(joya => joya.id === joyaId)

      if (!joya) {
        return res.status(404).send({
          message: 'Joya no encontrada',
          response: null,
          err: true
        })
      }

      return res.status(200).json({
        message: 'Joya obtenida',
        response: addHATEOAS([joya]),
        err: false
      })
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}

// TODO: implementar método postJoyas
export const createJoyas = async (req, res) => {
  try {
    if (
      !req.body.nombre ||
      !req.body.peso ||
      !req.body.precio ||
      !req.body.material
    ) {
      return res.status(400).send({
        message: 'Faltan datos de la joya',
        response: null,
        err: true
      })
    }

    // leer archivo
    const data = fs.readFileSync(`${__dirname}/db/joyas.json`, 'utf-8')
    const joyas = await JSON.parse(data)

    // obtener id de la ultima joya
    const ultimaJoya = joyas[joyas.length - 1]

    // crear nueva joya
    const newJoyas = {
      id: ultimaJoya.id + 1,
      nombre: req.body.nombre,
      peso: req.body.peso,
      precio: req.body.precio,
      material: req.body.material
    }

    // añadir nueva joya
    joyas.push(newJoyas)

    // guardar en el archivo
    fs.writeFile(`${__dirname}/db/joyas.json`, JSON.stringify(joyas), err => {
      if (err) {
        return res.status(500).send({
          message: 'Error al guardar la joya',
          response: null,
          err: true
        })
      }

      return res.status(201).json({
        message: 'Joya creada',
        response: addHATEOAS([newJoyas]),
        err: false
      })
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}

// TODO: implementar método putJoyas
export const putJoyas = async (req, res) => {
  try {
    const { id } = req.params
    const joyaId = parseInt(id)
    const { nombre, peso, precio, material } = req.body

    // Leer el archivo de joyas
    fs.readFile(`${__dirname}/db/joyas.json`, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }
      const joyas = JSON.parse(data)

      // Buscar la joya por su id
      const joyaIndex = joyas.findIndex(joya => joya.id === joyaId)

      // Verificar si la joya existe
      if (joyaIndex === -1) {
        return res
          .status(404)
          .json({ message: 'Joya no encontrada', response: null, err: true })
      }

      //verificando los datos ingresados
      if (
        !req.body.nombre ||
        !req.body.peso ||
        !req.body.precio ||
        !req.body.material
      ) {
        return res.status(400).json({
          message: 'Faltan datos de la joya',
          response: null,
          err: true
        })
      }

      // Actualizar los datos de la joya con los datos enviados en el cuerpo de la solicitud
      joyas[joyaIndex] = {
        ...joyas[joyaIndex],
        nombre,
        peso,
        precio,
        material
      }

      // Guardar los cambios en el archivo de joyas
      fs.writeFile(`${__dirname}/db/joyas.json`, JSON.stringify(joyas), err => {
        if (err) {
          return res.status(500).json({
            message: 'Error al guardar la joya',
            response: null,
            err: true
          })
        }

        return res.status(200).json({
          message: 'Joya actualizada',
          response: addHATEOAS([joyas[joyaIndex]]),
          err: false
        })
      })
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}

// TODO: implementar método deleteJoyas
export const deleteJoyas = async (req, res) => {
  try {
    const { id } = req.params
    const joyaId = parseInt(id)

    // Leer el archivo de joyas
    fs.readFile(`${__dirname}/db/joyas.json`, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }

      const joyas = JSON.parse(data)

      // Buscar la joya por su id
      const joyaIndex = joyas.findIndex(joya => joya.id === joyaId)

      // Verificar si la joya existe
      if (joyaIndex === -1) {
        return res
          .status(404)
          .json({ message: 'Joya no encontrada', response: null, err: true })
      }

      // Eliminar la joya del la data
      joyas.splice(joyaIndex, 1)

      //Actualizando los id de las joyas
      const newJoyas = joyas.map((joya, index) => ({
        ...joya,
        id: index + 1
      }))

      // Guardar los cambios en el archivo de joyas
      fs.writeFile(
        `${__dirname}/db/joyas.json`,
        JSON.stringify(newJoyas),
        err => {
          if (err) {
            return res.status(500).json({
              message: 'Error al guardar la joya',
              response: null,
              err: true
            })
          }

          return res
            .status(200)
            .json({ message: 'Joya eliminada', response: true, err: false })
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

// TODO: implementar métodos getJoyasPorNombre con include
export const getJoyasPorNombre = (req, res) => {
  try {
    fs.readFile(`${__dirname}/db/joyas.json`, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }
      const { nombre, order } = req.params
      const joyasParse = JSON.parse(data)
      const joyas = joyasParse
        .filter(e =>
          removeAcents(e.nombre.toLowerCase()).includes(
            removeAcents(nombre.toLowerCase())
          )
        )
        .sort((a, b) => {
          if (order === 'asc') {
            return 1
          } else if (order === 'desc') {
            return -1
          } else {
            return a.id - b.id
          }
        })

      if (joyas.length === 0) {
        return res.status(404).json({
          message: 'Nombre no encontrado',
          response: null,
          err: true
        })
      }

      res.status(200).json({
        message: 'Creado con éxito',
        response: addHATEOAS(joyas),
        err: false
      })
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}

// TODO: implementar métodos getJoyasPorMaterial
export const getJoyasPorMaterial = (req, res) => {
  try {
    fs.readFile(`${__dirname}/db/joyas.json`, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al leer el archivo',
          response: null,
          err: true
        })
      }
      const { material } = req.params
      const joyasParse = JSON.parse(data)
      const joyas = joyasParse.filter(
        e =>
          removeAcents(e.material.toLowerCase()) ===
          removeAcents(material.toLowerCase())
      )
      if (joyas.length === 0) {
        return res.status(404).json({
          message: 'Material no encontrado',
          response: null,
          err: true
        })
      }
      res.status(200).json({
        message: 'Material encontrado',
        response: addHATEOAS(joyas),
        err: false
      })
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      response: null,
      err: true
    })
  }
}

