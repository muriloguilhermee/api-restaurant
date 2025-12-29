import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("products").del();

    // Inserts seed entries
    await knex("products").insert([
        { id: 1, name: "Pizza", price: 10.00 },
        { id: 2, name: "Hamburguer", price: 5.00 },
        { id: 3, name: "Refrigerante", price: 3.00 },
        { id: 4, name: "Batata Frita", price: 2.00 },
        { id: 5, name: "Água", price: 1.00 },
        { id: 6, name: "Coca-Cola", price: 4.00 },
        { id: 7, name: "Água Mineral", price: 1.00 },
        { id: 8, name: "Cerveja", price: 3.00 },
        { id: 9, name: "Vinho", price: 10.00 },
        { id: 10, name: "Suco", price: 3.00 }
    ]);
};
