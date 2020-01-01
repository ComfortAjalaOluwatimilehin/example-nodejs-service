import { NextFunction, Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import { EUserRoles } from "../models/roles.enum"
import { IUserDocument, UserModel } from "../models/user"

export interface ITokenPayload {
    role: EUserRoles,
    email: string,
    id: string
}
export const generateToken = (user: IUserDocument): string => {
    const data: ITokenPayload = {
        role: user.role,
        email: user.email,
        id: user.id
    }
    const SIGNATURE = process.env.SIGNATURE
    if (!SIGNATURE) throw new Error("Signature does not exist")
    const EXPIRESIN = process.env.EXPIRESIN
    if (!EXPIRESIN) throw new Error("EXPIRESIN does not exist")
    return jwt.sign({ ...data }, SIGNATURE, { expiresIn: EXPIRESIN })
}
export const printtoken = (token: string): string => {
    return `Bearer ${token}`
}

export const gettokenfromheader = (req: Request): string | undefined => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        const [{ }, token] = req.headers.authorization.split(" ")
        return token

    } return undefined
}


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

    const token: string | undefined = gettokenfromheader(req)
    if (!token) return res.status(403).send("Valid token required")
    const SIGNATURE = process.env.SIGNATURE
    if (!SIGNATURE) return res.status(400).send()
    try {
        const tokenpayload: string | any = jwt.verify(token, SIGNATURE)
        if (typeof tokenpayload === "string") throw new Error("Unauthorized")
        const user = await UserModel.findOne({ _id: tokenpayload.id }).exec()
        // console.log(user, tokenpayload)
        if (!user) throw new Error("Unauthorized")
        if (user.role !== tokenpayload.role) throw new Error("Unauthorized: TOKEN IS NO LONGER VALID")
        res.locals.tokenpayload = tokenpayload
    } catch (err) {
        return res.status(400).send(`${err.message}`)
    }
    next()

}


export const isAuthorized = (Roles: EUserRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const tokenpayload: ITokenPayload = res.locals.tokenpayload
        if (!tokenpayload) return res.status(403).send("Not Authorized")
        if (Roles.indexOf(tokenpayload.role) > -1) return next()
        else return res.status(403).send("User is not authorized")
    }


}