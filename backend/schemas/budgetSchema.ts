import { z } from "zod"

const budgetSchema = z.object({
    id_proyecto: z
        .string({
            invalid_type_error: 'Debes ingresar una id de proyecto válida.',
            required_error: 'Debes indicar a qué proyecto pertenece este presupuesto.'
        })
        .refine(value => /^.{36}$/.test(value ?? ""), {
            message: 'La id del proyecto solo puede contener 36 caracteres!'
        }),
    id_inventario: z
        .string({
            invalid_type_error: 'Debes ingresar una id de inventario válida.',
            required_error: 'Debes indicar a qué inventario está asociado el presupuesto.'
        })
        .refine(value => /^.{36}$/.test(value ?? ""), {
            message: 'La id del inventario solo puede contener 36 caracteres!'
        }),
    id_usuario: z
        .string({
            invalid_type_error: 'Ingresa una id de usuario válida.',
            required_error: 'Debes asociar un usuario a este presupuesto.'
        })
        .refine(value => /^.{36}$/.test(value ?? ""), {
            message: 'La id del usuario solo puede contener 36 caracteres.'
        }),
    valor: z
        .number({
            invalid_type_error: 'Ingresa un valor válido.',
            required_error: 'El presupuesto debe tener un valor fijo.'
        })
        .min(0, {
            message: 'El valor del presupuesto no debe ser nulo.'
        })
        .int({
            message: 'El valor debe ser un número entero (no decimal)!'
        })
})

export const validateBudget = (object: Object) => {
    return budgetSchema.safeParse(object)
}