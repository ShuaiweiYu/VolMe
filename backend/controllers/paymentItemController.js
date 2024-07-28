import asyncHandler from 'express-async-handler';
import {getPrice, PaymentItem, PaymentItemModel} from '../models/util/PaymentItem.js'

const getPaymentItems = asyncHandler(async (req, res) => {
    const items = await PaymentItemModel.find()

    if (!items?.length) {
        return res.status(400).json({message: 'No items found'})
    }

    const updatedItems = items.map(item => {
        const { basePrice, discount, isOnSaleUntil } = item;
        const newPrice = getPrice(basePrice, discount, isOnSaleUntil);
        return { ...item.toObject(), price: newPrice };
    });

    res.json(updatedItems);
})

const getPaymentItemById = asyncHandler(async (req, res) => {
    const {itemId} = req.params

    const item = await PaymentItemModel.findById(itemId)

    if (item) {
        const { basePrice, discount, isOnSaleUntil } = item;
        const newPrice = getPrice(basePrice, discount, isOnSaleUntil);
        res.json({ ...item.toObject(), price: newPrice });
    } else {
        res.status(404).json({message: 'Item not found'})
    }
})

const createPaymentItem = asyncHandler(async (req, res) => {
    const {name, price, description, type} = req.body

    // type must be SERVICE or PRODUCT
    const paymentItemObj = new PaymentItem(name, description, price, type)

    const paymentItem = await PaymentItemModel.create(paymentItemObj)

    if (paymentItem) {
        res.status(201).json(paymentItem)
    } else {
        res.status(400).json({message: 'Invalid paymentItem received'})
    }
})

const deletePaymentItem = asyncHandler(async (req, res) => {
    const {id} = req.body

    const item = await PaymentItemModel.findByIdAndDelete(id)

    if (!item) {
        return res.status(400).json({message: 'item not found'})
    } else {
        return res.status(200).json({message: 'item deleted'})
    }
})

const setDiscount = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const {isOnSaleUntil, discount} = req.body

    if (discount > 1 || isOnSaleUntil < new Date()) {
        res.status(400).json({message: 'Invalid discount argument received'})
    }

    const item = await PaymentItemModel.findOne({_id: itemId })

    if (item) {
        item.isOnSaleUntil = isOnSaleUntil
        item.discount = discount
        await item.save()
        res.status(200).json({message: 'Update Success'});
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
})

export default {
    getPaymentItems,
    getPaymentItemById,
    createPaymentItem,
    deletePaymentItem,
    setDiscount,
}