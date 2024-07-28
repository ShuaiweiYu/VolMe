import express from 'express'
import wishlistItemController from '../controllers/wishlistItemController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

router.use(verifyJWT)

// Route definitions
router.route('/')
    .post(wishlistItemController.addWishlistItem)
    .get(wishlistItemController.getAllWishlistItems)

router.route('/user/:userId')
    .get(wishlistItemController.getAllWishlistItemsForUser)

router.route('/:wishlistItemId')
    .get(wishlistItemController.getWishlistItemById)
    .put(wishlistItemController.updateWishlistItem)
    .delete(wishlistItemController.deleteWishlistItem)

//DELETE /wishlist/user/:userId/:wishlistItemId
router.route('/user/:userId/:wishlistItemId')
    .delete(wishlistItemController.deleteWishlistItemForUser)

//DELETE /wishlist/user/:userId/event/:eventId
router.route('/user/:userId/event/:eventId')
    .delete(wishlistItemController.deleteWishlistItemByEvent)

// Route to delete all wishlist items for a specific user
router.route('/user/:userId')
    .delete (wishlistItemController.deleteAllWishlistItemsForUser);


export default router