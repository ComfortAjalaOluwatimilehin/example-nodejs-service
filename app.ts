import bodyparser from "body-parser"
import cors from "cors"
import express, { Application } from "express"
import morgan from "morgan"
import { HealthRoute } from "./routes/health.route"
import StaffApi from "./routes/staff.route"
import UserApi from "./routes/user.route"
class StaffServiceClientSingleton {
    client: Application
    constructor() {
        let client = express()
        client.use(bodyparser.urlencoded({ extended: true }))
        client.use(bodyparser.json())
        client.use(morgan("combined"))
        client.use(cors())
        this.client = client
        this.setroutes()
    }

    setroutes(): void {
        this.client.get("/health", HealthRoute)
        StaffApi(this.client)
        UserApi(this.client)
    }


}


let StaffServiceClient = (new StaffServiceClientSingleton()).client

export default StaffServiceClient