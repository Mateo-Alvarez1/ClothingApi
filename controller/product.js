
import { db } from "../helpers/dbConfig.js"
import { validatePartialProduct, validateProduct } from "../schemas/product.js"

export class ProductController {
    static async create (req , res) {
        const result = validateProduct(req.body)
        if (result.error) res.status(400).json({ error: JSON.parse(result.error.message) })
        
        const {
            name,
            description,
            color,
            categoryId,
            price,
            stock,
            img_link
        } = req.body
    
        const category = await db.execute({
            sql: `SELECT * from category WHERE id = ?;`,
            args: [categoryId]
        })
    
        if (category.rows.length === 0) return res.json({error: 'No category found with this id'})
        
        try {
            const duplicate = await db.execute({
                sql: `SELECT * FROM product WHERE name = ? AND description = ? AND color = ? AND price = ? AND stock = ? AND img_link = ?`,
                args:  [ name,description,color,price,stock,img_link]
            })
            
            if (duplicate.rows.length > 0) {
                return res.status(400).json({ error: "There is already a product with those details" });
            }
        
            await db.execute({
                sql: `INSERT INTO product (name , description , color , categoryId ,price,stock , img_link)
                      VALUES (?,?,?,?,?,?,?)`,
                args: [ name,description,color,categoryId,price,stock,img_link]
            })
        
            const query = await db.execute({
                sql: `SELECT * FROM product WHERE name = ?;`,
                args: [name]
            })
    
            const product = query.rows[query.rows.length - 1];
            const length = category.rows.length - 1
            const response = {
                name: product.name,
                description: product.description,
                color: product.color,
                categoryId: category.rows[length],
                price: product.price,
                stock: product.stock,
                img_link: product.img_link
            };
            
            return res.json(response);
        } catch (e) {
            console.log(e);
        }
    }
    static async getAll (req , res) {
        try {
            const products = await db.execute({
                sql: `SELECT * FROM product`,
                args: []
            })
        
            if (products.rows.length === 0)return res.json({error: 'List of products is empty'})
            
            res.json(products.rows)
        }catch(e){
            console.log(e);
        }
    }
    static async getById (req , res) {
        
    const { id } = req.params
    if (!id)return res.json({error: 'It is necessary to provide an id'})

    try {
        
            const product = await db.execute({
                sql: `SELECT * FROM product WHERE id = ?`,
                args: [id]
            })
        
        if (product.rows.length === 0) return res.json({ error: 'There is no product with this id' })
        
        return res.json(product.rows)
    } catch (e) {
        console.log(e);
    }
        
    }
    static async update(req, res) {
        
    const result = validatePartialProduct(req.body)
    if (result.error)return res.sendStatus(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params

    const {
        name,
        description,
        color,
        price,
        categoryId ,
        stock,
        img_link
    } = req.body

    try {
        
        const product = await db.execute({
            sql: `SELECT * FROM product WHERE id = ? `,
            args : [id]
        })
    
        if (!product.rows.length > 0 ) return res.json({ error: 'No product with this id was found in the database.'})
          
         await db.execute({
            sql: `UPDATE product SET name = ? , description = ? ,categoryId = ?, color = ? , price = ? ,stock = ? ,img_link = ? WHERE id = ? ;`,
            args: [name , description , categoryId, color , price , stock , img_link , id]
        })
    
        return res.json({message : 'Update Product Successfully'})
    } catch (e) {
        console.log(e);
    }
    }
    static async delete(req, res) {
        
        const { id } = req.params
        if (!id) return res.json({ error: 'It is necessary to provide an id' })
        try {
            const product = await db.execute({
                sql: `SELECT * FROM product WHERE id = ? `,
                args : [ id]
            })
    
            if (!product.rows.length > 0 ) return res.json({ error: 'No product with this id was found in the database.'})
    
            await db.execute({
                sql: `DELETE FROM product WHERE id = ?;`,
                args: [id]
            })
    
            res.json({message: 'Delete product successfully'})
        } catch (e) {
            console.log(e);
        }
    }
}