import { z } from "zod"

const projectSchema = z.object({
    id_usuario: z
        .string({
            required_error: 'Debes indicar un usuario a cargo del proyecto!',
            invalid_type_error: 'Ingresa un usuario válido.'
        })
        .refine(value => /^.{36}$/.test(value ?? ""), {
            message: 'La id del usuario debe contener 36 caracteres.'
        }),
    nombre: z.string({
        required_error: 'El proyecto debe tener un nombre!',
        invalid_type_error: 'Ingresa un nombre válido.'
    })
    .refine(value => /^.{0,100}$/.test(value ?? ""), {
        message: 'El nombre puede tener hasta 100 caracteres.'
    })
})

export const validateProject = (object: Object) => {
    return projectSchema.safeParse(object)
}