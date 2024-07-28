import mongoose from 'mongoose';

const {Schema} = mongoose;

class WishlistItem {
    constructor(user, event) {
        this.user = user;
        this.event = event;
    }
}

// Define the WishlistItem schema
const WishlistItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
});

// Create the WishlistItem model
const WishlistItemModel = mongoose.model('WishlistItem', WishlistItemSchema); //two arguments: name of the model (collection) and the schema

export {WishlistItem, WishlistItemModel};
