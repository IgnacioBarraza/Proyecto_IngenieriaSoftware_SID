import express from 'express'
import { randomUUID } from 'crypto'

import { connect } from '../utils/db'
import { verifyMedia } from '../schemas/mediaSchema'
import authorizeRole from '../middleware/authorizeRole'

const mediaRouter = express.Router()

mediaRouter.get('/', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query(`SELECT * FROM medios_comunicacion`)

        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor al intentar obtener los datos.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

mediaRouter.post('/new', authorizeRole, async (req, res) => {
    const connection = connect()

    const verifyData = verifyMedia(req.body)

    if (verifyData.error) {
        return res.status(400).json({ message: JSON.parse(verifyData.error.message)[0].message })
    }

    try {
        const searchMedia = await connection.query(`SELECT * FROM medios_comunicacion WHERE nombre_medio = ?`, [verifyData.data.nombre])

        if (Array.isArray(searchMedia[0]) && searchMedia[0].length > 0) {
            res.status(404).json({ message: 'Este medio ya existe en la base de datos!' })
            return
        } else {
            const newMedia = {
                id_medio: randomUUID(),
                nombre_media: verifyData.data.nombre,
                tipo_media: verifyData.data.tipo_medios
            }

            await connection.query(`INSERT INTO medios_comunicacion (id_medio, nombre_medio, tipo_medios) VALUES (?, ?, ?)`, [newMedia.id_medio, newMedia.nombre_media, newMedia.tipo_media])

            return res.status(201).json({ message: 'Medio de comunicación creada!', id: newMedia.id_medio })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error intentando añadir el medio de comunicación a la base de datos.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

mediaRouter.put('/update/:id', authorizeRole, async (req, res) => {
    const mediaId = req.params.id
    const connection = connect()

    const verifyData = verifyMedia(req.body)

    if (verifyData.error) {
        return res.status(400).json({ message: JSON.parse(verifyData.error.message)[0].message })
    }

    try {
        const searchMedia = await connection.query(`SELECT * FROM medios_comunicacion WHERE id_medio = ?`, [mediaId])

        if (Array.isArray(searchMedia[0]) && searchMedia[0].length > 0) {
            const updateMedia = {
                nombre_media: verifyData.data.nombre,
                tipo_media: verifyData.data.tipo_medios
            }

            await connection.query(`
                UPDATE medios_comunicacion
                SET nombre_medio = ?,
                tipo_medios = ?
                WHERE id_medio = ?
            `, [updateMedia.nombre_media, updateMedia.tipo_media, mediaId])

            return res.status(200).json({ message: 'Medio de comunicación actualizado!' })
        } else {
            return res.status(404).json({ message: 'Medio de comunicación no encontrado.' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error intentando actualizar el medio de comunicación.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

mediaRouter.delete('/delete/:id', authorizeRole, async (req, res) => {
    const mediaId = req.params.id
    const connection = connect()

    try {
        const searchMedia = await connection.query(`SELECT * FROM medios_comunicacion WHERE id_medio = ?`, [mediaId])

        if (Array.isArray(searchMedia[0]) && searchMedia[0].length > 0) {
            await connection.query(`DELETE FROM medios_comunicacion WHERE id_medio = ?`, [mediaId])

            return res.status(200).json({ message: 'Medio de comunicación eliminado.' })
        } else {
            return res.status(400).json({ message: 'Medio de comunicación no encontrado.' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema intentando eliminar el medio de comunicación.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default mediaRouter