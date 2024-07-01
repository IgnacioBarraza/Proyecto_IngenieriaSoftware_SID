import express from 'express'
import mysql from 'mysql2/promise'
import { randomUUID } from 'crypto'

import { connect } from '../utils/db'
import { validateCart, validateUpdateCart } from '../schemas/cartSchema'

const cartRouter = express.Router()

cartRouter.get('/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    try {
        const [row, fields] = await connection.query(`SELECT * FROM shopping_cart WHERE id_usuario = ?`, [id])
        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error con el servidor. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

cartRouter.post('/new', async (req, res) => {
    const connection = connect()

    const validateData = validateCart(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM usuario WHERE id_usuario = ?`, validateData.data.id_usuario)
        const user = row as mysql.RowDataPacket[]

        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({ message: 'No hay ningún usuario con esa id.' })
        }

        const newOrder = {
            id_shopping_cart: randomUUID(),
            id_usuario: validateData.data.id_usuario,
            valor_total: validateData.data.valor_total,
            id_servicios: validateData.data.id_servicios
        }

        await connection.query(`INSERT INTO shopping_cart (id_shopping_cart, id_usuario, valor_total, id_servicios) VALUES (?, ?, ?, ?)`, [newOrder.id_shopping_cart, newOrder.id_usuario, newOrder.valor_total, newOrder.id_servicios])
        return res.status(201).json({ message: 'Orden guardada con éxito!', id: newOrder.id_shopping_cart })
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor al intentar guardar la orden.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

cartRouter.put('/update/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    const validateData = validateUpdateCart(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM shopping_cart WHERE id_shopping_cart = ?`, [id])
        const order = row as mysql.RowDataPacket[]
        const [row2, field2] = await connection.query(`SELECT * FROM usuario WHERE id_usuario = ?`, [validateData.data.id_usuario])
        const user = row2 as mysql.RowDataPacket[]

        if (Array.isArray(user) && user.length === 0) {
            return res.status(400).json({ message: 'No hay ningún usuario asociado a esa id.' })
        }

        if (Array.isArray(row) && row.length > 0) {
            const updatedOrder = {
                id_usuario: validateData.data.id_usuario ?? order[0].id_usuario,
                valor_total: validateData.data.valor_total ?? order[0].valor_total,
                id_servicios: validateData.data.id_servicios ?? order[0].id_servicios
            }

            await connection.query(`
                UPDATE shopping_cart
                SET id_usuario = ?,
                valor_total = ?,
                id_servicios = ?
                WHERE id_shopping_cart = ?
            `, [updatedOrder.id_usuario, updatedOrder.valor_total, updatedOrder.id_servicios, id])

            return res.status(200).json({ message: 'Orden actualizada!' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error al intentar actualizar la orden. Intente más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

cartRouter.delete('/delete/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    try {
        const [row, fields] = await connection.query(`SELECT * FROM shopping_cart WHERE id_shopping_cart = ?`, [id])
        const order = row as mysql.RowDataPacket[]

        if (Array.isArray(order) && order.length > 0) {
            await connection.query(`DELETE FROM shopping_cart WHERE id_shopping_cart = ?`, [id])
            return res.status(200).json({ message: 'La orden se ha eliminado con éxito.' })
        } else {
            return res.status(400).json({ message: 'No hay una orden asociada a esa id.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor al intentar eliminar la orden. Inténtelo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default cartRouter