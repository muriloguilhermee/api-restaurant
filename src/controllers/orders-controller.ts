import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { knex } from "@/database/knex"
import { TablesSessionsRepository } from "@/database/types/tables-sessions-repository"
import { AppError } from "@/utils/AppError"
import { OrderRepository } from "@/database/types/order-repository"

class OrdersController {
    async create(request: Request, response: Response, next: NextFunction){
        try {
            const bodySchema = z.object({
                table_session_id: z.number(),
                product_id: z.number(),
                quantity: z.number()
            })
            const { table_session_id, product_id, quantity } = bodySchema.parse(request.body)

           const session = await knex<TablesSessionsRepository>("tables_sessions")
           .where({ id: table_session_id})
           .first()

           if(!session){
            throw new AppError("Session table not found", 404)
           }
           if(session.closed_at){
            throw new AppError("Session table is closed", 400)
           }
           const product = await knex<ProductRepository>("products")
           .where({ id: product_id})
           .first()

           if(!product){
            throw new AppError("Product not found", 404)
           }

           const order = await knex<OrderRepository>("orders")
           .insert({
            table_session_id,
            product_id,
            quantity,
            price: product.price
           })

            return response.status(201).json()            
        } catch (error) {
            next(error)
        }
    }

    async index(request: Request, response: Response, next: NextFunction){
        try {
            const { table_session_id } = request.params

            const order = await knex("orders")
            .select("orders.id",
            "orders.table_session_id",
            "orders.product_id",
            "products.name",
            "orders.price",
            "orders.quantity", 
            knex.raw("orders.price * orders.quantity as total"), "orders.created_at", "orders.updated_at"
            )

            .join("products", "orders.product_id", "products.id")
            .where({ table_session_id })
            .orderBy("orders.created_at", "asc")
            return response.status(200).json(order)
        } catch (error) {
            next(error)
        }
    }

    async show(request: Request, response: Response, next: NextFunction){
        try {
            const { table_session_id } = request.params

            const order = await knex("orders")
            .select(knex.raw("COALESCE (SUM(orders.price * orders.quantity), 0) as total"),
            knex.raw("COALESCE (SUM(orders.quantity), 0) as quantity"))
            .where({ table_session_id })
            .first()
            return response.json(order)
        } catch (error) {
            next(error)
        }
    }
}

export { OrdersController }
