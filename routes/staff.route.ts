import { Application } from "express";
import { createstaff, getallstaff } from "../controllers/staff.controller";
import { isAuthenticated } from "../helpers/token";

export default function (app: Application) {

    app.get("/staffs", isAuthenticated, getallstaff)
    app.post("/staffs", createstaff)

}