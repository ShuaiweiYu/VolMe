import mongoose from 'mongoose';
import {User, UserModel} from './User.js';

class Admin extends User {
    constructor(emailAddress, username, hashedPassword) {
        super(emailAddress, username, hashedPassword, "ADMIN")
    }
}

const AdminSchema = new mongoose.Schema({
    ...UserModel.schema.obj
})

const AdminModel = UserModel.discriminator('Admin', AdminSchema)

export {Admin, AdminModel}