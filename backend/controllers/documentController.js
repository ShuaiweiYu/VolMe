import asyncHandler from "express-async-handler";
import {Document, DocumentModel} from "../models/util/Document.js";

/* Document POST one Document http://localhost:3500/api/documents/create*/
const createDocument = asyncHandler(async (req, res) => {
        const eventIds = req.body.eventId ? [req.body.eventId] : [];
        const userId = req.body.userId;
        const name = req.body.name;
        const path = req.body.path;// this should be unique for each document .
        const type = req.body.type;
        const requiredFileType=req.body.requiredFileType;

        const documentExists = await DocumentModel.findOne({
            name: name, userId: userId,
        });

        if (documentExists) {
            if (!documentExists.eventIds.includes(eventIds)) {
                documentExists.eventIds.push(eventIds);
            }

            await documentExists.save();
            return res.status(200).json(documentExists);
        } else try {
            const document = await DocumentModel.create({eventIds, userId, name, path, type,requiredFileType});
            return res.status(201).json(document);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
)
const getDocumentById = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId;

    try {
        const document = await DocumentModel.findById(documentId);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return res.status(200).json(document);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const getDocumentsByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    try {
        const documents = await DocumentModel.find({userId: userId});

        return res.status(200).json(documents);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});
const getDocumentsByUserIdAndEventId = asyncHandler(async (req, res) => {
    const { userId, eventId } = req.params;

    try {
        const documents = await DocumentModel.find({userId: userId, eventIds: {$in: [eventId]}});
        return res.status(200).json(documents);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

const deleteDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId

    try {
        const documents = await DocumentModel.deleteOne({_id: documentId})
        return res.status(200).json(documents);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

export default {createDocument, getDocumentById, getDocumentsByUserId, getDocumentsByUserIdAndEventId, deleteDocument}