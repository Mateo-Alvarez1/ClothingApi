import bcrypt from 'bcryptjs'
import { validatePartialUserdata, validateUserdata } from "../schemas/auth.js";
import { SignJWT } from "jose";
import { db } from '../helpers/dbConfig.js';

const encoder = new TextEncoder()

export class AuthController {
    static async signup(req, res) {
        const result = validateUserdata(req.body)

    if (result.error) res.status(400).json({ error: JSON.parse(result.error.message) })

    const {
      name,
      lastname,
      email,
      password
    } = req.body

    const hashRounds = 10
    const encodedPassword = await bcrypt.hash(password, hashRounds)

    try {
      const emailuser = await db.execute({
        sql: 'SELECT * FROM user WHERE email = ?;',
        args: [email]
      })

      if (emailuser.rows.length > 0) {
        const userWithEmail = emailuser.rows[0]
          if (userWithEmail.email === email) return res.status(400).json({ error:  'The e-mail address is already registered.'})
      }

      await db.execute({
        sql: `INSERT INTO user (  name ,lastname,email,password)
              VALUES (?,?,?,?);`,
        args: [name, lastname, email, encodedPassword]
      })

      const user = await db.execute({
        sql: 'SELECT * FROM user WHERE email = ?;',
        args: [email]
      })

        
      return res.json(user.rows)
    } catch (e) {
      console.log(e)
    }
    }
    static async login(req, res) {
        const result = validatePartialUserdata(req.body)

        if (result.error) {
          res.status(400).json({ error: JSON.parse(result.error.message) })
        }
    
        const { email, password } = req.body
    
        if (!email || !password) return res.sendStatus(400).json({error: 'The email and password cannot be empty.'})
    
        try {
          const user = await db.execute({
            sql: 'SELECT * FROM user WHERE email = ?;',
            args: [email]
          })
    
          if (user.rows.length === 0) return res.sendStatus(401).json({error: 'There is no user with this email address'})
    
          const { rows } = user
          const [userObj] = rows
    
          const jwtContructor = new SignJWT({ userObj })
          const jwt = await jwtContructor
            .setProtectedHeader({ alg: 'HS256', typ: 'jwt' })
            .setIssuedAt()
            .setExpirationTime('1hr')
            .sign(encoder.encode(process.env.SECRET_KEY))
    
          return res.status(200).json({ token: jwt })
        } catch (e) {
          console.log(e)
        }
    }
    static async getByEmail(req, res) {
        const { email } = req.params
    if (!email) return res.json({ error: 'The email cannot be empty' })
    try {
        const user = await db.execute({
            sql: `SELECT * FROM user WHERE email = ?`,
            args: [email]
        })

        if (!user) return res.json({ error: 'No user with that email was found in the database.' })

        return res.json(user.rows)
    } catch (e) {
        console.log(e);
    }
    }
}