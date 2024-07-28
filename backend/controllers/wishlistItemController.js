import asyncHandler from 'express-async-handler';
import {WishlistItemModel} from '../models/util/WishlistItem.js';
import {EventModel} from "../models/event/Event.js";

// @desc Create a new wishlist item
// @route POST /wishlist
const addWishlistItem = asyncHandler(async (req, res) => {
    const {userId, eventId} = req.body; // Destructuring assignment

    // Validate input
    if (!userId || !eventId) {
        return res.status(400).json({message: 'User ID and Event ID are required'});
    }

    try {
        // Check for duplicate wishlist item
        const existingWishlistItem = await WishlistItemModel.findOne({ user: userId, event: eventId });
        if (existingWishlistItem) {
            return res.status(400).json({ message: 'Wishlist item already exists for this user and event' });
        }

        // Fetch event details
        const event = await EventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({message: 'Event not found'});
        }

        // Create and save the wishlist item
        const wishlistItem = await WishlistItemModel.create({user: userId, event: eventId});

        res.status(201).json({message: 'Wishlist item added successfully', wishlistItem});
    } catch (error) {
        console.error('Error adding wishlist item:', error);
        res.status(500).json({message: 'Failed to add wishlist item'});
    }
});


// @desc Get all wishlist items
// @route GET /wishlist
const getAllWishlistItems = asyncHandler(async (req, res) => {
    try {
        const wishlistItems = await WishlistItemModel.find().populate('user').populate('event');
        res.json(wishlistItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
});

// @desc Get all wishlist items for a user
// @route GET /wishlist/user/:userId
const getAllWishlistItemsForUser = asyncHandler(async (req, res) => {
    const {userId} = req.params; // Extract user ID from request parameters

    // Find all wishlist items for the specific user and populate user and event details
    const wishlistItems = await WishlistItemModel.find({user: userId})
        .populate('user') // populate referenced documents in a query result, replacing specified paths (usually ObjectId references) with actual documents from other collections
        .populate('event');

    res.json(wishlistItems);
});

// @desc Get a wishlist item by ID
// @route GET /wishlist/:wishlistItemId
const getWishlistItemById = asyncHandler(async (req, res) => {
    const {wishlistItemId} = req.params;

    // Find wishlist item by ID and populate user and event details
    const wishlistItem = await WishlistItemModel.findById(wishlistItemId)
        .populate('user')
        .populate('event');

    // Check if wishlistItem is null (no item found for the ID)
    if (!wishlistItem) {
        return res.status(404).json({message: 'Wishlist item not found'});
    }

    res.json(wishlistItem);
});


// @desc Update a wishlist item
// @route PUT /wishlist/:wishlistItemId
const updateWishlistItem = asyncHandler(async (req, res) => {
    const {wishlistItemId} = req.params;
    const updateData = req.body;

    try {
        // Fetch the current date
       // const currentDate = new Date();

        // Fetch the WishlistItem by ID and populate the 'event' field
        const wishlistItem = await WishlistItemModel.findById(wishlistItemId).populate('user').populate('event');

        // Check if wishlistItem is null (no item found for the ID)
        if (!wishlistItem) {
            return res.status(404).json({message: 'Wishlist item not found'});
        }

        // Save the updated wishlist item
        await wishlistItem.save();

        // Respond with the updated wishlist item
        res.json(wishlistItem);
    } catch (error) {
        console.error('Error updating wishlist item:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

/*const updateWishlistItem = asyncHandler(async (req, res) => {
    const { wishlistItemId } = req.params;
    const updateData = req.body;

    // Check if the event date is passed to update isUpcoming
    const updatedFields = {
        ...updateData,
        isUpcoming: updateData.date ? new Date(updateData.date) > new Date() : true
    };

    // Update the wishlist item by ID and populate user and event details
    const wishlistItem = await WishlistItemModel.findByIdAndUpdate(
        wishlistItemId,
        updatedFields,
        { new: true }
    ).populate('user').populate('event');

    // Check if wishlistItem is null (no item found for the ID)
    // // This check is essential to handle scenarios where the findByIdAndUpdate method does not find a matching document with the specified wishlistItemId
    if (!wishlistItem) {
        return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json(wishlistItem);
});

 */


// @desc Delete a wishlist item
// @route DELETE /wishlist/:wishlistItemId
const deleteWishlistItem = asyncHandler(async (req, res) => {
    const {wishlistItemId} = req.params;

    // Attempt to delete the wishlist item by ID
    const deletedItem = await WishlistItemModel.findByIdAndDelete(wishlistItemId);

    // Check if no item was found to delete
    if (!deletedItem) {
        return res.status(404).json({message: 'Wishlist item not found'});
    }

    // Respond with success message if deletion was successful
    res.json({message: 'Wishlist item deleted successfully'});
});

// @desc Delete a wishlist item for a specific user
// @route DELETE /wishlist/user/:userId/:wishlistItemId
const deleteWishlistItemForUser = asyncHandler(async (req, res) => {
    const {userId, wishlistItemId} = req.params;

    try {

        // Attempt to delete the wishlist item by ID
        const deletedItem = await WishlistItemModel.findByIdAndDelete(wishlistItemId);

        // Check if no item was found to delete
        if (!deletedItem) {
            return res.status(404).json({message: 'Wishlist item not found'});
        }

        // Respond with success message if deletion was successful
        res.json({message: 'Wishlist item deleted successfully'});
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error('Error deleting wishlist item:', error);
        res.status(500).json({message: 'Server error: Could not delete wishlist item'});
    }


});

// @desc Delete all wishlist items for a specific user
// @route DELETE /wishlist/user/:userId
const deleteAllWishlistItemsForUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedItems = await WishlistItemModel.deleteMany({ user: userId });

        if (deletedItems.deletedCount === 0) {
            return res.status(404).json({ message: 'No wishlist items found for this user' });
        }

        res.json({ message: 'All wishlist items deleted successfully' });
    } catch (error) {
        console.error('Error deleting all wishlist items for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const deleteWishlistItemByEvent = asyncHandler(async (req, res) => {
    const { userId, eventId } = req.params;
    //console.log(`userId: ${userId}, eventId: ${eventId}`);

    try {
        const deletedItem = await WishlistItemModel.findOneAndDelete({ user: userId, event: eventId });
        if (!deletedItem) {
            return res.status(404).json({ errors: [{ msg: "Wished Item not found" }] });
        }
        return res.json(deletedItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default {
    addWishlistItem,
    getAllWishlistItems,
    getAllWishlistItemsForUser,
    getWishlistItemById,
    updateWishlistItem,
    deleteWishlistItem,
    deleteWishlistItemForUser,
    deleteWishlistItemByEvent,
    deleteAllWishlistItemsForUser
};
