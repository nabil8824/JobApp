import express from 'express'
import dotenv from "dotenv"; 
import path from "path";   
import "./src/utils/CRON/index.js"
dotenv.config({ path: path.resolve('.env') });
import  boootstrap  from './src/app.controller.js';

const app = express()

const port = process.env.PORT||3001
boootstrap(app,express)
 
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
