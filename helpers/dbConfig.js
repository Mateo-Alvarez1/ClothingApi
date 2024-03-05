import dotenv from 'dotenv'
import { createClient } from "@libsql/client";

    
dotenv.config()
    
export const db = createClient({
    url:'libsql://clothing-api-mateo-alvarez1.turso.io',
    authToken: process.env.DB_TOKEN   
}) 
    

// TABLES

db.execute(
    `CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        name VARCHAR(100),
        description TEXT ,
        categoryId INTEGER ,
        color VARCHAR(100),
        price INTEGER ,
        stock INTEGER,
        img_link TEXT
    );`
)

db.execute(
    `CREATE TABLE IF NOT EXISTS category(
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        name VARCHAR(100)
);`)


db.execute(
    `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        name VARCHAR(50),
        lastname VARCHAR(50),
        email VARCHAR(100),
        password VARCAHR(50)
    );`
)

