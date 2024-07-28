import { Schema, model } from "mongoose";

const EventCustomizedFieldSchema = new Schema({
    name: {type: String},
    valve: {type: String}
})

const applicationSchema = new Schema({
    applicationDate: {
        type: Date,
        required: true
    },
    eventID: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    volunteerID: {
        type: Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    status: {
        type: String,
        default: "PENDING"
    },
    isPresented: {
        type: Boolean,
        default: false
    },
    files:{
        type:[Schema.Types.ObjectId],
        ref:'Document',
        required:false
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    customizedApplicationFields: {
        type: [EventCustomizedFieldSchema]
    }
}, { timestamps: true });

export const Application = model("Application", applicationSchema)
