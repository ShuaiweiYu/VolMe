import mongoose from "mongoose";

const Schema = mongoose.Schema;

class PaymentItem {
    constructor(name, description, basePrice) {
        this.name = name
        this.description = description
        this.type = "SERVICE"
        this.category = "SOFTWARE"
        this.basePrice = basePrice
        this.isOnSaleUntil = null
        this.discount = 0
    }
}

const getPrice = (basePrice, discount, isOnSaleUntil) => {
    if (!isOnSaleUntil || !discount) return basePrice
    const now = new Date()
    if (now < isOnSaleUntil) {
        return parseFloat((basePrice * (1 - discount)).toFixed(2))
    } else {
        return basePrice
    }
}

const PaymentItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },

    isOnSaleUntil: {
        type: Date,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
})

const PaymentItemModel = mongoose.model('PaymentItem', PaymentItemSchema)

export {PaymentItem, PaymentItemModel, getPrice}