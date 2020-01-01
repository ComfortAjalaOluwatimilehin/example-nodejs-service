import { connect } from "mongoose";
import App from "./app";
require("dotenv-flow").config();


const port = process.env.PORT || 5000

const dbresource: string = `${process.env.DBURI}/${process.env.DBNAME}`

connect(dbresource, (err) => {
    console.log(`Mongoose is successfully connected`)
})

App.listen(port, () => {
    console.log(`Server listening @ port ${port}`)
})