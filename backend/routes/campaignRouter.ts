import express from 'express'
import { randomUUID } from 'crypto'

import { connect } from '../utils/db'
import { validateCampaign } from '../schemas/campaignSchema'
import authorizeRole from '../middleware/authorizeRole'

const campaignRouter = express.Router();

campaignRouter.get('/', async (req, res) => {
    const connection = connect()

    try {
        const [row, fields] = await connection.query(`SELECT * FROM campanha;`)

        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error al intentar obtener las campañas.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

campaignRouter.post('/new', authorizeRole, async (req, res) => {
    const connection = connect()

    const validateData = validateCampaign(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const searchCampaign = await connection.query(`SELECT * from campanha WHERE nombre = '${validateData.data.nombre}'`)

        if (Array.isArray(searchCampaign[0]) && searchCampaign[0].length > 0) {
            return res.status(404).json({ message: 'El nombre de la campaña ingresada ya existe en la base de datos.' })
        } else {
            const campaignData = {
                id_campanha: randomUUID(),
                nombre: validateData.data.nombre,
                presupuesto: validateData.data.presupuesto
            }

            await connection.query(`INSERT INTO campanha (id_campanha, nombre, presupuesto) VALUES (?, ?, ?)`, [campaignData.id_campanha, campaignData.nombre, campaignData.presupuesto])

            return res.status(201).json({ message: 'Campaña añadida exitosamente!', id: campaignData.id_campanha })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error intentando guardar la campaña en la base de datos.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

campaignRouter.put('/update/:id', authorizeRole, async (req, res) => {
    const campaignId = req.params.id
    const connection = connect()

    const validateData = validateCampaign(req.body)

    if (validateData.error) {
        return res.status(400).json({ message: JSON.parse(validateData.error.message)[0].message })
    }

    try {
        const searchCampaign = await connection.query(`SELECT * FROM campanha WHERE id_campanha = ?`, [campaignId])

        if (Array.isArray(searchCampaign[0]) && searchCampaign[0].length > 0) {
            const newCampaignData = {
                nombre: validateData.data.nombre,
                presupuesto: validateData.data.presupuesto
            }

            await connection.query(`
                UPDATE campanha
                SET nombre = ?,
                presupuesto = ?
                WHERE id_campanha = ?
            `, [newCampaignData.nombre, newCampaignData.presupuesto, campaignId])

            return res.status(200).json({ message: 'Campaña actualizada.' })
        } else {
            return res.status(404).json({ message: 'La campaña no existe en la base de datos.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error actualizando la campaña.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

campaignRouter.delete('/delete/:id', authorizeRole, async (req, res) => {
    const campaignId = req.params.id
    const connection = connect()

    try {
        const searchCampaign = await connection.query(`SELECT * FROM campanha WHERE id_campanha = ?`, [campaignId])

        if (Array.isArray(searchCampaign[0]) && searchCampaign[0].length > 0) {
            await connection.query(`DELETE FROM campanha WHERE id_campanha = ?`, [campaignId])
            return res.status(200).json({ message: 'La campaña fue eliminada exitosamente.' })
        } else {
            return res.status(404).json({ message: 'La campaña no existe en la base de datos.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error al intentar eliminar la campaña.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default campaignRouter