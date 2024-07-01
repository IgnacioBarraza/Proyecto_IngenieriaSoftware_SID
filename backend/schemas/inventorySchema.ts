import { z } from "zod"

const inventorySchema = z.object({
    nombre: z
        .string({
            invalid_type_error: 'Indica un nombre válido!',
            required_error: 'Debes añadir un nombre para el inventario!'
        })
        .refine(value => /^.{0,250}$/.test(value), {
            message: 'El nombre puede tener hasta 250 caracteres!'
        }),
    id_equipos: z
        .string({
            invalid_type_error: 'Indica datos de id válidos!',
            required_error: 'Debes señalar los equipos asociados!'
        }),
    id_servicios: z
        .string({
            invalid_type_error: 'Indica datos de id válidos!',
            required_error: 'Debes señalar los servicios correspondientes!'
        })
})

const updateInventorySchema = z.object({
    nombre: z
        .string({
            invalid_type_error: 'Ingresa un nombre válido!'
        })
        .optional(),
    id_equipos: z
        .string({
            invalid_type_error: 'Debes ingresar valores válidos.'
        })
        .optional(),
    id_servicios: z
        .string({
            invalid_type_error: 'Debes ingresar ids de servicios válidos.'
        })
        .optional()
})

export const verifyInventory = (object: Object) => {
    return inventorySchema.safeParse(object)
}

export const verifyUpdatedInventory = (object: Object) => {
    return updateInventorySchema.safeParse(object)
}