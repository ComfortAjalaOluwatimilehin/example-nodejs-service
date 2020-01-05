import { Application } from "express"
import { HealthRoute } from "../routes/health.route"

export default function (app: Application) {

    app.get("/health", HealthRoute)


}