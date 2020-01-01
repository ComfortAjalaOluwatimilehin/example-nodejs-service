import { Document, model, Schema } from "mongoose";
import { EStaffRoles } from "./roles.enum";

export interface IStaff {
    fullname: string;
    role: EStaffRoles;
    email: string;
}

export interface IStaffModel extends IStaff, Document {
}



const StaffSchema: Schema = new Schema({
    fullname: { type: Schema.Types.String, required: true },
    role: {
        type: Schema.Types.String, required: true, validate: {
            validator: (role: EStaffRoles) => {
                const options = [EStaffRoles.MANAGER]
                return options.indexOf(role) > -1
            },
            message: `The Role is invalid`
        }
    },
    email: { type: Schema.Types.String, required: true },
})


export const StaffModel = model<IStaffModel>("Staff", StaffSchema)