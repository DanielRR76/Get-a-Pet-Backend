import express from 'express'
import cors from 'cors'
import UserRoutes from './routes/UserRoutes.mjs'
import PetRoutes from './routes/PetRoutes.mjs'
import connection from './db/mysql.mjs'

const app = express()


//config JSON response
app.use(express.json())

//config URL encoded
app.use(express.urlencoded({extended: true}))


//solve CORS
app.use(cors({credentials: true, origin: 'http://localhost:3001'}))

//Public folder for images
app.use(express.static('public'))

//Routes
app.use('/users',UserRoutes)
app.use('/pets',PetRoutes)

//Database connection
connection.sync().then(() => {
    app.listen(5000, () => console.log('Backend is running on port 5000!'))
}).catch((error) => console.error(error))