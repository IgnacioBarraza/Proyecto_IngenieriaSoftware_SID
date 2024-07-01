import express from 'express'
import { randomUUID } from 'crypto'
import mysql from 'mysql2/promise'

import { connect } from '../utils/db'
import { validateService, validateUpdateService } from '../schemas/serviceSchema'

const serviceRouter = express.Router()

serviceRouter.post('/new', async (req, res) => {
    const connection = connect()
    
    const verifyData = validateService(req.body)

    if (verifyData.error) {
        return res.status(400).json({ message: JSON.parse(verifyData.error.message)[0].message })
    }

    try {
        const searchService = await connection.query(`SELECT * FROM servicios WHERE nombre = ?`, [verifyData.data.nombre])

        if (Array.isArray(searchService[0]) && searchService[0].length > 0) {
            return res.status(400).json({ message: 'El servicio ingresado ya existe en la base de datos!' })
        }

        const newService = {
            id_servicios: randomUUID(),
            nombre: verifyData.data.nombre,
            precio: verifyData.data.precio,
            descripcion: verifyData.data.descripcion,
            imagen: verifyData.data.imagen
        }

        await connection.query(`INSERT INTO servicios (id_servicios, nombre, precio, descripcion, imagen_link) VALUES (?, ?, ?, ?, ?)`, [newService.id_servicios, newService.nombre, newService.precio, newService.descripcion, newService.imagen])
        return res.status(201).json({ message: 'Servicio creado!', id: newService.id_servicios })
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor al intentar guardar el servicio. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

serviceRouter.put('/update/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    const verifyData = validateUpdateService(req.body)

    if (verifyData.error) {
        return res.status(400).json({ message: JSON.parse(verifyData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM servicios WHERE id_servicios = ?`, [id])
        const user = row as mysql.RowDataPacket[]

        if (Array.isArray(user) && user.length > 0) {
            const updatedProduct = {
                nombre: verifyData.data.nombre ?? user[0].nombre,
                precio: verifyData.data.precio ?? user[0].precio,
                descripcion: verifyData.data.descripcion ?? user[0].descripcion,
                imagen: verifyData.data.imagen ?? user[0].imagen_link
            }

            await connection.query(`
                UPDATE servicios
                SET nombre = ?,
                precio = ?,
                descripcion = ?,
                imagen_link = ?
                WHERE id_servicios = ?
            `, [updatedProduct.nombre, updatedProduct.precio, updatedProduct.descripcion, updatedProduct.imagen, id])

            return res.status(200).json({ message: 'Servicio actualizado!' })
        } else {
            return res.status(400).json({ message: 'No hay ningún servicio con ese identificador.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error con el servidor al intentar actualziar el servicio. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

serviceRouter.delete('/delete/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    try {
        const [row, fields] = await connection.query(`SELECT * FROM servicios WHERE id_servicios = ?`, [id])
        const user = row as mysql.RowDataPacket[]

        if (Array.isArray(user) && user.length > 0) {
            await connection.query(`DELETE FROM servicios WHERE id_servicios = ?`, [id])
            return res.status(200).json({ message: 'Servicio eliminado correctamente!' })
        } else {
            return res.status(400).json({ message: 'No hay ningún servicio asociado a esa id.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error con el servidor al intentar eliminar el servicio. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default serviceRouter