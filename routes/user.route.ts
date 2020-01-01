import { Application } from "express";
import { createuser, getallusers, login, patchuser } from "../controllers/user.controller";
import { isAuthenticated, isAuthorized } from "../helpers/token";
import { EUserRoles } from "../models/roles.enum";

export default function (app: Application) {

    app.post("/users", createuser)
    app.get("/users", isAuthenticated, isAuthorized([EUserRoles.ADMIN, EUserRoles.MANAGER]), getallusers)
    app.patch("/users", isAuthenticated, isAuthorized([EUserRoles.ADMIN, EUserRoles.VIEWER]), patchuser)
    app.post("/login", login)
}