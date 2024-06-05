import express from 'express'
import { randomUUID } from 'crypto'
import mysql from 'mysql2/promise'

import { connect } from '../utils/db'
import { verifyInventory, verifyUpdatedInventory } from '../schemas/inventorySchema'
import authorizeRole from '../middleware/authorizeRole'

const inventoryRouter = express.Router()

inventoryRouter.post('/new', authorizeRole, async (req, res) => {
    const connection = connect()

    const verifyData = verifyInventory(req.body)

    if (verifyData.error) {
        return res.status(400).json({ message: JSON.parse(verifyData.error.message)[0].message })
    }

    try {
        const searchInventario = await connection.query(`SELECT * FROM inventario WHERE nombre_inventario = ?`, [verifyData.data.nombre])

        if (Array.isArray(searchInventario[0]) && searchInventario[0].length > 0) {
            return res.status(400).json({ message: 'Este inventario ya existe.' })
        } else {
            const newInventory = {
                id_inventory: randomUUID(),
                nombre_inventario: verifyData.data.nombre,
                id_equipos: verifyData.data.id_equipos,
                id_servicios: verifyData.data.id_servicios
            }

            await connection.query(`INSERT INTO inventario (id_inventario, nombre_inventario, id_equipos, id_servicios) VALUES (?, ?, ?, ?)`, [newInventory.id_inventory, newInventory.nombre_inventario, newInventory.id_equipos, newInventory.id_servicios])

            return res.status(201).json({ message: 'Inventario creado!' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ message: 'Hubo un error al intentar agregar el inventario a la base de datos.' })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

inventoryRouter.put('/update/:id', authorizeRole, async (req, res) => {
    const inventoryId = req.params.id
    const connection = connect()

    const verifyData = verifyUpdatedInventory(req.body)

    if (verifyData.error) {
        return res.status(400).json({ message: JSON.parse(verifyData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM inventario WHERE id_inventario = ?`, [inventoryId])
        const inventario = row as mysql.RowDataPacket[]

        if (Array.isArray(inventario) && inventario.length > 0) {
            const updatedInventory = {
                nombre: verifyData.data.nombre ?? inventario[0].nombre_inventario,
                id_equipos: verifyData.data.id_equipos ?? inventario[0].id_equipos,
                id_servicios: verifyData.data.id_servicios ?? inventario[0].id_servicios
            }

            await connection.query(`
                UPDATE inventario
                SET nombre_inventario = ?,
                id_equipos = ?,
                id_servicios = ?
                WHERE id_inventario = ?
            `, [updatedInventory.nombre, updatedInventory.id_equipos, updatedInventory.id_servicios, inventoryId])

            return res.status(200).json({ message: 'Inventario actualizado!' })
        } else {
            return res.status(400).json({ message: 'El inventario que se quiere actualizar no existe en la base de datos.' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ message: 'Hubo un error al intentar actualizar el inventario.' })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

inventoryRouter.delete('/delete/:id', authorizeRole, async (req, res) => {
    const inventoryId = req.params.id
    const connection = connect()

    try {
        const searchInventory = await connection.query(`SELECT * FROM inventario WHERE id_inventario = ?`, [inventoryId])

        if (Array.isArray(searchInventory[0]) && searchInventory[0].length > 0) {
            await connection.query(`DELETE FROM inventario WHERE id_inventario = ?`, [inventoryId])

            return res.status(200).json({ message: 'Inventario eliminado.' })
        } else {
            return res.status(400).json({ message: 'El inventario no existe en la base de datos.' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ message: 'Hubo un problema al intentar eliminar el inventario.' })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default inventoryRouter