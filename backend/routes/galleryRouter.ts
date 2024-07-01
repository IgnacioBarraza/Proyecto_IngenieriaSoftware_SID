import express from 'express'
import { randomUUID } from 'crypto'
import mysql from 'mysql2/promise'

import { connect } from '../utils/db'
import { validateImage, validateUpdateImage } from '../schemas/gallerySchema'

const galleryRouter = express.Router()

galleryRouter.post('/new', async (req, res) => {
    const connection = connect()

    const verifyData = validateImage(req.body)

    if (verifyData.error) {
        return res.status(400).json({ message: JSON.parse(verifyData.error.message)[0].message })
    }

    try {
        const searchImage = await connection.query(`SELECT * FROM gallery WHERE imagen_link = ?`, [verifyData.data.imagen_link])

        if (Array.isArray(searchImage[0]) && searchImage[0].length > 0) {
            return res.status(400).json({ message: 'La imagen ya está en la galería!' })
        }

        const newImage = {
            id_image: randomUUID(),
            id_servicios: verifyData.data.id_servicios,
            imagen_link: verifyData.data.imagen_link
        }

        await connection.query(`INSERT INTO gallery (id_imagen, id_servicios, imagen_link) VALUES (?, ?, ?)`, [newImage.id_image, newImage.id_servicios, newImage.imagen_link])
        return res.status(201).json({ message: 'La imagen se ha agregado con éxito.',  id: newImage.id_image  })
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error con el servidor. Inténtalo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

galleryRouter.put('/update/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    const validateData = validateUpdateImage(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const [row, fields] = await connection.query(`SELECT * FROM gallery WHERE id_imagen = ?`, [id])
        const image = row as mysql.RowDataPacket[]

        if (Array.isArray(image) && image.length > 0) {
            const newImage = {
                id_servicios: validateData.data.id_servicios ?? image[0].id_servicios,
                imagen_link: validateData.data.imagen_link ?? image[0].imagen_link
            }

            await connection.query(`
                UPDATE gallery
                SET id_servicios = ?,
                imagen_link = ?
                WHERE id_imagen = ?
                `, [newImage.id_servicios, newImage.imagen_link, id]
            )

            return res.status(200).json({ message: 'Los datos de la imagen se han actualizado con éxito.' })
        } else {
            return res.status(400).json({ message: 'No hay ninguna imagen asociada.' })
        }
    } catch (error) {
        return res.status(500).json({ messge: 'Hubo un error en el servidor al intentar actualizar los datos de la imagen. Inténtelo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

galleryRouter.delete('/delete/:id', async (req, res) => {
    const connection = connect()
    const id = req.params.id

    try {
        const [row, fields] = await connection.query(`SELECT * FROM gallery WHERE id_imagen = ?`, [id])
        const image = row as mysql.RowDataPacket[]

        if (Array.isArray(image) && image.length > 0) {
            await connection.query(`DELETE FROM gallery WHERE id_imagen = ?`, [id])
            return res.status(200).json({ message: 'La imagen se ha eliminado de la galería.' })
        } else {
            return res.status(400).json({ message: 'No hay ninguna imagen asociada a esa id.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error en el servidor al intentar eliminar la imagen. Intentelo más tarde.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default galleryRouter