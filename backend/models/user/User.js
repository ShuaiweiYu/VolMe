import mongoose from 'mongoose';

const {Schema} = mongoose;

class User {
    constructor(emailAddress, username, hashedPassword, role) {
        this.emailAddress = emailAddress;
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.role = role;
        this.profilePicturePath = "";
        this.phoneNumber = "";
        this.isBlocked = false
        this.isValidUser = false
    }
}

const UserSchema = new Schema({
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    profilePicturePath: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true
    },
    isValidUser: {
        type: Boolean,
        required: true
    }
});

const UserModel = mongoose.model('User', UserSchema);

export {User, UserModel};
