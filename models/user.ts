import { compare, hash } from "bcrypt";
import { Document, model, Schema } from "mongoose";
import { EUserRoles } from "./roles.enum";


export interface IUser {
    email: string,
    password: string,
    role: EUserRoles,

}


export interface IUserDocument extends IUser, Document { }


const UserSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        required: true,
        validate: {
            validator: (role: EUserRoles) => {
                const options = [EUserRoles.MANAGER, EUserRoles.ADMIN, EUserRoles.VIEWER]
                return options.indexOf(role) > -1
            },
            message: `The Role is invalid`
        }
    }
})


UserSchema.pre<IUserDocument>("save", async function () {
    const password = this.password
    const saltRounds = 10;
    const hashedpassword = await hash(password, saltRounds)
    this.password = hashedpassword
    return
})

UserSchema.methods.validatepassword = async function (password: string): Promise<boolean> {
    const isSimilar: boolean = await compare(password, this.password)
    return isSimilar
}

export const UserModel = model<IUserDocument>("User", UserSchema)