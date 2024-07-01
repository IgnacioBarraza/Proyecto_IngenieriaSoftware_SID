import express from 'express'
import { randomUUID } from 'crypto'
import mysql from 'mysql2/promise'

import { connect } from '../utils/db'
import { validateItem, validateUpdateItem } from '../schemas/equipmentSchema'

const equipmentRouter = express.Router()

equipmentRouter.post('/new', async (req, res) => {
    const connection = connect()

    const validateData = validateItem(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM equipment WHERE nombre_equipo = ?` ,[validateData.data.nombre_equipo])

        if (Array.isArray(row) && row.length > 0) {
            return res.status(400).json({ message: 'Ya existe un equipo registrado con ese nombre! Prueba con otro.' })
        }

        const newItem = {
            id_equipo: randomUUID(),
            nombre_equipo: validateData.data.nombre_equipo,
            tipo_equipo: validateData.data.tipo_equipo,
            id_servicios: validateData.data.id_servicios
        }

        await connection.query(`INSERT INTO equipment (id_equipo, nombre_equipo, tipo_equipo, id_servicios) VALUES (?, ?, ?, ?)`, [newItem.id_equipo, newItem.nombre_equipo, newItem.tipo_equipo, newItem.id_servicios])
        return res.status(201).json({ message: 'El equipo se ha guardado con éxito.', id: newItem.id_equipo })
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error al intentar guardar el equipo. Intente más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

equipmentRouter.put('/update/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    const validateData = validateUpdateItem(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM equipment WHERE id_equipo = ?`, [id])
        const item = row as mysql.RowDataPacket[]

        if (Array.isArray(item) && item.length > 0) {
            const updatedItem = {
                nombre_equipo: validateData.data.nombre_equipo ?? item[0].nombre_equipo,
                tipo_equipo: validateData.data.tipo_equipo ?? item[0].tipo_equipo,
                id_servicios: validateData.data.id_servicios ?? item[0].id_servicios
            }

            await connection.query(`
                UPDATE equipment
                SET nombre_equipo = ?,
                tipo_equipo = ?,
                id_servicios = ?
                WHERE id_equipo = ?
            `, [updatedItem.nombre_equipo, updatedItem.tipo_equipo, updatedItem.id_servicios, id])

            return res.status(200).json({ message: 'El equipo se ha actualizado con éxito.' })
        } else {
            return res.status(400).json({ message: 'No hay ningún equipo asociado!' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error con el servidor al intentar actualizar el equipo. Intenta más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

equipmentRouter.delete('/delete/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    try {
        const [row, fields] = await connection.query(`SELECT * FROM equipment WHERE id_equipo = ?`, [id])

        if (Array.isArray(row) && row.length > 0) {
            await connection.query(`DELETE FROM equipment WHERE id_equipo = ?`, [id])
            return res.status(200).json({ message: 'El equipo se ha eliminado con éxito.' })
        } else {
            return res.status(400).json({ message: 'No se ha podido encontrado el equipo.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un problema con el servidor al intentar eliminar el equipo. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default equipmentRouter