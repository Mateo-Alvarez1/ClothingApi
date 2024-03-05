import { db } from "../helpers/dbConfig.js"
import { validateCategory, validatePartialCategory } from "../schemas/category.js"

export class CategoryController {
    static async create(req, res) {
        const result = validateCategory(req.body)
        if (result.error) res.status(400).json({ error: JSON.parse(result.error.message) })
    
        const {
            name
        } = req.body
    
        try {
            const duplicate = await db.execute({
                sql: `SELECT * FROM category WHERE name = ? `,
                args: [name]
            })
        
            if (duplicate.rows.length > 0) {
                const row = duplicate.rows.find(n => n.name === name)
                if (row.name === name) return res.sendStatus(400).json({ error: "There is already a category with that name." });
            }
            await db.execute({
                sql: `INSERT INTO category (name)
                        VALUES (?)`,
                args: [name]
            })
            
            const query = await db.execute({
                sql: `SELECT * FROM category WHERE name = ?`,
                args: [name]
            })
            
            const length = query.rows.length - 1
            return res.json(query.rows[length])
            
        } catch (e) {
            console.error(e);
        }

    }
    static async getAll(req, res) {
        try {
    
            const categoryes = await db.execute({
                sql: `SELECT * FROM category`,
                args: []
            })
        
            if (categoryes.rows.length === 0) return res.json({ error: 'List of categoryes is empty' })
            
            res.json(categoryes.rows)
        } catch (e) {
            console.log(e);
        }
    }
    static async getById(req, res) {
        const { id } = req.params
        if (!id) return res.json({ error: 'It is necessary to provide an id' })
    
        try {
            
            const category = await db.execute({
                sql: `SELECT * FROM category WHERE id = ?`,
                args: [id]
            })
            
            if (category.rows.length === 0) return res.json({ error: 'There is no category with this id' })
            
            return res.json(category.rows)
        } catch (e) {
            console.log(e);
        }
    }
    static async delete(req, res) {
        const { id } = req.params
        if (!id) return res.json({ error: 'It is necessary to provide an id' })

        try {
            const product = await db.execute({
                sql: `SELECT * FROM category WHERE id = ? `,
                args: [id]
            })

            if (!product.rows.length > 0) return res.json({ error: 'No category with this id was found in the database.' })

            await db.execute({
                sql: `DELETE FROM category WHERE id = ?;`,
                args: [id]
            })

            res.json({ message: 'Delete category successfully' })
        } catch (e) {
            console.log(e);
        }

    }
    static async update (req, res) {

        const result = validatePartialCategory(req.body)
        if (result.error) return res.sendStatus(400).json({ error: JSON.parse(result.error.message) })
    
        const { id } = req.params
    
        const {
            name
        } = req.body
    
        try {
            
            const product = await db.execute({
                sql: `SELECT * FROM category WHERE id = ? `,
                args: [id]
            })
        
            if (!product.rows.length > 0) return res.json({ error: 'No category with this id was found in the database.' })
              
        
            await db.execute({
                sql: `UPDATE category SET name = ? WHERE id = ? ;`,
                args: [name, id]
            })
        
            return res.json({ message: 'Update category  Successfully' })
        } catch (e) {
            console.log(e);
        }
  
    }
}