import { compare } from "bcrypt";
import { Request, Response } from "express";
import { generateToken, ITokenPayload, printtoken } from "../helpers/token";
import { EUserRoles } from "../models/roles.enum";
import { UserModel } from "../models/user";

export const createuser = async (req: Request, res: Response) => {

    try {
        if (!req.body) throw new Error("Error while reading request bodys")
        const { email, password } = req.body
        if (!email || !password) throw new Error("Required fields: email <string>, password <string>")
        const user = new UserModel({ email, password, role: EUserRoles.VIEWER })
        await user.save()
        //generate token
        const token: string = generateToken(user)

        return res.status(200).json({ token: printtoken(token) })

    } catch (err) {
        res.set({
            "Content-Type": "text/html; charset=UTF-8"
        })
        return res.status(404).send(`<h1>${err.message}</h1>`)
    }
}


export const getallusers = async (req: Request, res: Response) => {

    try {
        const users = await UserModel.find().lean().exec()
        res.set({
            "Content-Type": "application/json"
        })
        // console.log(users)
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(403).send(err.message)
    }
}



export const patchuser = async (req: Request, res: Response) => {

    try {
        const tokenpayload: ITokenPayload = res.locals.tokenpayload
        await UserModel.updateOne({ _id: tokenpayload.id }, { ...req.body })
        const user = await UserModel.findOne({ _id: tokenpayload.id }).lean().exec()
        return res.status(200).json({ ...user })
    } catch (err) {
        return res.status(403).send(err.message)
    }
}
const validatepassword = async function (hashedpassword: string, password: string): Promise<boolean> {
    const isSimilar: boolean = await compare(password, hashedpassword)
    return isSimilar
}
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email }).exec()
        if (!user || user === null) throw new Error("Invalid User")
        const isSimilar: boolean = await validatepassword(user.password, password)
        console.log(user)
        if (isSimilar === false) throw new Error("Invalid User")
        const token = generateToken(user)
        return res.status(200).send(printtoken(token))
    } catch (err) {
        return res.status(403).send(err.message)
    }
}