import mongoose from "mongoose";

const Schema = mongoose.Schema;

class Code {
    constructor(digit, usage, userId) {
        this.value = this.#getNumber(digit)
        this.usage = usage
        this.assignTo = userId
        this.isValid = true
        this.secret = null
    }

    #getNumber = (digit) => {
        if (digit < 0 || !Number.isInteger(digit)) {
            throw new Error("The digit must be a positive number")
        }
        const min = Math.pow(10, digit - 1);
        const max = Math.pow(10, digit) - 1;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const CodeSchema = new Schema({
    value: {
        type: Number,
        required: true
    },
    usage: {
        type: String,
        required: true
    },
    assignTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    secret: {
        type: String,
        required: false
    },
    isValid: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '60m'  // the code will be deleted after 60 mins
    }
})

const CodeModel = mongoose.model('Code', CodeSchema)

export {Code, CodeModel};