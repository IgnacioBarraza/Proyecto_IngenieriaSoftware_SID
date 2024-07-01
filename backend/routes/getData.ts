import express from 'express'

import { connect } from '../utils/db'

const dataRouter = express.Router()

dataRouter.get('/services', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query(`SELECT * FROM servicios`)
        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error con el servidor. Intente más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

dataRouter.get('/gallery', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query(`SELECT * FROM gallery`)
        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor. Intente más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

dataRouter.get('/inventory', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query(`SELECT * FROM inventario`)

        return res.status(200).json(row)
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error intentando obtener los artículos del inventario.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

dataRouter.get('/equipment', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query('Select * FROM equipment')

        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error al intentar conseguir los equipos. Intente más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

dataRouter.get('/collaborations', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query(`SELECT * FROM colaborations`)
        
        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error con el servidor. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default dataRouter