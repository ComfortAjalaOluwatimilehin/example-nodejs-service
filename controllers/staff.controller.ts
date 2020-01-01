import { Request, Response } from "express";
import { IStaff, IStaffModel, StaffModel } from "../models/staff";

export const getallstaff = async (req: Request, res: Response) => {

    try {

        const AllStaff: IStaffModel[] = await StaffModel.find().lean().exec()
        if (AllStaff && AllStaff.length === 0) throw new Error("no staff")
        res.set({
            "Content-Type": "application/json"
        })
        return res.status(200).json({ staffs: AllStaff })
    } catch (err) {
        res.set({
            "Content-Type": "text/html; charset=UTF-8"
        })
        return res.status(404).send(`<h1>${err.message}</h1>`)
    }
}


export const createstaff = async (req: Request, res: Response) => {

    try {
        const { body }: Request = req
        if (!body) throw new Error("Error while parsing body")
        const { fullname, role, email }: IStaff = body
        // console.log(req.body)
        if (!fullname || !role || !email) throw new Error("Required Fields: fullname <string>, roles <Array>, email <string>")
        const staff = new StaffModel({ fullname, role, email })
        await staff.save()
        const newstaff: IStaffModel = await StaffModel.findOne({ fullname }).lean().exec()
        res.set({
            "Content-Type": "application/json"
        })
        return res.status(200).json(newstaff)
    } catch (err) {
        res.set({
            "Content-Type": "text/html; charset=UTF-8"
        })
        return res.status(404).send(`<h1>${err.message}</h1>`)
    }
}