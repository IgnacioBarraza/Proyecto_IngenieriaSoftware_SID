import express from 'express'

import { connect } from '../utils/db'
import { validateUser } from '../schemas/userSchema'
import authorizeRole from '../middleware/authorizeRole'

const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
    const connection = connect()
    
    try {
        const [row, fields] = await connection.query(`SELECT * FROM usuario`)

        return res.status(200).json(row)
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un problema al obtener datos de los usuarios.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

userRouter.put('/update/:id', authorizeRole, async (req, res) => {
    const userId = req.params.id
    const connection = connect()

    const result = validateUser(req.body)

    if (result.error) {
        return res.status(400).json({ message: JSON.parse(result.error.message)[0].message })
    }

    try {
        const searchUser = await connection.query(`SELECT * FROM usuario WHERE id_usuario = ?`, [userId])

        if (Array.isArray(searchUser[0]) && searchUser[0].length > 0) {
            const updatedUser = {
                username: result.data.username,
                email: result.data.email,
                telefono: result.data.phone,
                tipo_user: result.data.tipo_user,
                direccion: result.data.direction
            }

            await connection.query(`
                UPDATE usuario
                SET username = ?,
                correo = ?,
                telefono = ?,
                tipo_user = ?,
                direccion = ?
                WHERE id_usuario = ?
            `, [updatedUser.username, updatedUser.email, updatedUser.telefono, updatedUser.tipo_user, updatedUser.direccion, userId])

            return res.status(200).json({ message: 'Usuario actualizado!' })
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error intentando actualizar el usuario.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

userRouter.delete('/delete/:id', authorizeRole, async (req, res) => {
    const userId = req.params.id
    const connection = connect()

    try {
        const searchUser = await connection.query(`SELECT * FROM usuario WHERE id_usuario = ?`, [userId])
        
        if (Array.isArray(searchUser[0]) && searchUser[0].length > 0) {
            await connection.query(`DELETE FROM usuario WHERE id_usuario = ?`, [userId])

            return res.status(200).json({ message: 'Usuario eliminado de la base de datos.' })
        } else {
            return res.status(400).json({ message: 'Usuario no encontrado.' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un problema al intentar eliminar el usuario de la base de datos.', error })
    } finally {
        if (connection) {
            connection.end()
        }
    }
})

export default userRouter