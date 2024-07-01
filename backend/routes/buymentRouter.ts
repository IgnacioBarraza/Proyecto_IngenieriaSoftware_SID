import express from 'express'
import { randomUUID } from 'crypto'
import mysql from 'mysql2/promise'

import { connect } from '../utils/db'
import { validateBuymentData, validateUpdateBuyment } from '../schemas/buymentScema'

const buymentRouter = express.Router()

buymentRouter.get('/', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query('SELECT * FROM buyment')

        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Ha habido un problema. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

buymentRouter.post('/new', async (req, res) => {
    const connection = connect()

    const validateData = validateBuymentData(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const newOrder = {
            id_buyment: randomUUID(),
            id_usuario: validateData.data.id_usuario,
            total_compra: validateData.data.total_compra,
            id_servicios: validateData.data.id_servicios,
            fecha_compra: new Date()
        }
        
        await connection.query(`INSERT INTO buyment (id_buyment, id_usuario, total_compra, id_servicios, fecha_compra) VALUES (?, ?, ?, ?, ?)`, [newOrder.id_buyment, newOrder.id_usuario, newOrder.total_compra, newOrder.id_servicios, newOrder.fecha_compra])

        return res.status(201).json({ message: 'Se ha registrado la compra con éxito.', id: newOrder.id_buyment })
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un problema en el servidor al intentar registrar la compra.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

buymentRouter.put('/update/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    const validateData = validateUpdateBuyment(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM buyment WHERE id_buyment = ?`, [id])
        const searchBuyment = row as mysql.RowDataPacket[]

        if (Array.isArray(searchBuyment) && searchBuyment.length > 0) {
            const updatedBuyment = {
                id_usuario: validateData.data.id_usuario ?? searchBuyment[0].id_usuario,
                total_compra: validateData.data.total_compra ?? searchBuyment[0].total_compra,
                id_servicios: validateData.data.id_servicios ?? searchBuyment[0].id_servicios
            }

            await connection.query(`
                UPDATE buyment
                SET id_usuario = ?,
                total_compra = ?,
                id_servicios = ?
                WHERE id_buyment = ?
            `, [updatedBuyment.id_usuario, updatedBuyment.total_compra, updatedBuyment.id_servicios, id])

            return res.status(200).json({ message: 'Datos de compra actualizados!' })
        } else {
            return res.status(400).json({ message: 'No hay ninguna compra asociada a esa id.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor al intentar registrar la compra. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

buymentRouter.delete('/delete/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    try {
        const [row, fields] = await connection.query('SELECT * FROM buyment WHERE id_buyment = ?', [id])
        const searchBuyment = row as mysql.RowDataPacket[]

        if (Array.isArray(searchBuyment) && searchBuyment.length > 0) {
            await connection.query('DELETE FROM buyment WHERE id_buyment = ?', [id])
        } else {
            return res.status(400).json({ message: 'No hay ninguna compra asociada a esa id.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor al intentar eliminar la compra. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default buymentRouter