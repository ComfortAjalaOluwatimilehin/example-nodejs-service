const { config } = require("dotenv")
import { connect } from "mongoose";
import path from "path";
import App from "./app";
const configpath
    = path.join(__dirname, `../config/${process.env.NODE_ENV}.env`)
// console.log("path exists", existsSync(configpath))
// console.log("PATH", configpath)
const result = config({ path: configpath });
if (result.error) {
    throw result.error
}

console.log(result.parsed)
console.log("NODE_ENV", process.env.NODE_ENV)
console.log("PORT", process.env.PORT)
console.log("DBNAME", process.env.DBNAME)
const dbresource: string = `${process.env.DBURI}`

connect(dbresource, (err) => {
    console.log(`Mongoose is successfully connected`)
})

App.listen(process.env.PORT, () => {
    console.log(`Server listening @ port ${process.env.PORT}`)
})