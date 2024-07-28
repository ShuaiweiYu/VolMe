import mongoose from "mongoose";

const Schema = mongoose.Schema;

class Document {
    constructor(type, path, userId, applicationIds, eventIds, name,requiredFileType) {
        this.type = type
        this.path = path
        this.name = name
        this.userId = userId
        this.eventIds = eventIds
        this.requiredFileType=requiredFileType
    }
}

const DocumentSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventIds: {
        type: [Schema.Types.ObjectId],
        ref: 'Event',
        required: false
    },
    requiredFileType:{
        type:String,
        required: false
    }

})

const DocumentModel = mongoose.model('Document', DocumentSchema)

export {Document, DocumentModel}