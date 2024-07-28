import asyncHandler from 'express-async-handler';
import PaypalConfig from "../config/paypalConfig.js"
import paypal from "@paypal/checkout-server-sdk";
import { UserModel } from '../models/user/User.js';
import fetch from 'node-fetch';
import {PaymentItemModel, getPrice } from "../models/util/PaymentItem.js";

const createOrder = asyncHandler(async (req, res) => {
    const amount = req.body.amount;
    const itemId = req.body.itemId
    
    const item = await PaymentItemModel.findById(itemId)
    const itemPrice = getPrice(item.basePrice, item.discount, item.isOnSaleUntil)
    
    const itemTotal = amount * itemPrice
    const taxTotal = itemTotal * 0.19;
    const totalPrice = itemTotal + taxTotal;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'EUR',
                    value: totalPrice.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: itemTotal.toFixed(2)
                        },
                        tax_total: {
                            currency_code: 'EUR',
                            value: taxTotal.toFixed(2)
                        }
                    }
                },
                items: [
                    {
                        name: 'Volme PayAsYouGo Plan',
                        unit_amount: {
                            currency_code: "EUR",
                            value: itemPrice.toString()
                        },
                        quantity: amount.toString()
                    }
                ]
            }
        ]
    });


    try {
        const order = await PaypalConfig.client().execute(request);
        res.json({id: order.result.id});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

const captureOrder = asyncHandler(async (req, res) => {
    const orderID = req.body.orderID;
    const amount = req.body.amount;
    const userID = req.body.userID;
    
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await PaypalConfig.client().execute(request);

        const user = await UserModel.findOne({ _id: userID });
        user.unusedPaidSubscription = user.unusedPaidSubscription + amount
        if (user.subscriptionType === "FREE") {
            user.subscriptionType = "PAYASYOUGO"
        }
        const updatedUser = await user.save();

        res.json({capture});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// https://developer.paypal.com/docs/subscriptions/integrate/
const createProduct = asyncHandler(async (req, res) => {
    try {
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const authString = `${clientId}:${clientSecret}`;
        const encodedAuth = Buffer.from(authString).toString('base64');

        const itemId = req.body.itemId
        const item = await PaymentItemModel.findById(itemId)
        const payPalRequestId = "VOLME-SUBSCRIPTION-ITEM-" + item._id

        const response = await fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedAuth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'PayPal-Request-Id': payPalRequestId,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                name: item.name,
                description: item.description.join(', '),
                type: item.type,
                category: item.category,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create product');
        }

        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const createPlan = asyncHandler(async (req, res) => {
    try {
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const authString = `${clientId}:${clientSecret}`;
        const encodedAuth = Buffer.from(authString).toString('base64');

        const productId = req.body.productId;

        const itemId = req.body.itemId
        const item = await PaymentItemModel.findById(itemId)
        const isAnnualPayment = req.body.isAnnualPayment
        
        let itemPrice
        if (!isAnnualPayment) {
            itemPrice = getPrice(item.basePrice, item.discount, item.isOnSaleUntil)
        } else {
            itemPrice = parseFloat((getPrice(item.basePrice, item.discount, item.isOnSaleUntil) * 12 * 0.95).toFixed(2))
        }
        
        const payPalRequestId = "VOLME-SUBSCRIPTION-ITEM_ID-" + item._id
        
        const monthlySubscription = {
            frequency: { interval_unit: "MONTH", interval_count: 1 },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 12,
            pricing_scheme: { fixed_price: { value: itemPrice, currency_code: "EUR" } }
        }

        const yearlySubscription = {
            frequency: { interval_unit: "YEAR", interval_count: 1 },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 3,
            pricing_scheme: { fixed_price: { value: itemPrice, currency_code: "EUR" } }
        }

        const response = await fetch('https://api-m.sandbox.paypal.com/v1/billing/plans', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedAuth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'PayPal-Request-Id': payPalRequestId,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                product_id: productId,
                name: item.name,
                description: item.description.join(", "),
                status: "ACTIVE",
                billing_cycles: [
                    isAnnualPayment ? yearlySubscription: monthlySubscription
                ],
                payment_preferences: {
                    auto_bill_outstanding: true,
                    setup_fee: { value: "0", currency_code: "EUR" },
                    setup_fee_failure_action: "CONTINUE",
                    payment_failure_threshold: 3
                },
                taxes: { percentage: "19", inclusive: true }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create plan');
        }

        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_cancel
const cancelSubscription = asyncHandler(async (req, res) => {
    const cancelReason = "cancel by user's request"

    try {
        const user = await UserModel.findOne({ _id: userID });
        const subscriptionId = user.subscriptionId
        if (!subscriptionId) {
            res.status(400).send("No Subscription found");
        }
        
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const authString = `${clientId}:${clientSecret}`;
        const encodedAuth = Buffer.from(authString).toString('base64');

        const userID = req.body.userID;

        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedAuth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ reason: cancelReason })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to cancel subscription');
        }

        user.subscriptionId = null
        await user.save()
        res.json({ message: 'Subscription cancelled successfully', data });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_get
const checkSubscriptionIsValid = asyncHandler(async (req, res) => {
    try {
        const userID = req.body.userID;
        const user = await UserModel.findOne({ _id: userID });
        const subscriptionId = user.subscriptionId;

        if (!subscriptionId) {
            return res.status(400).send("No Subscription found");
        }

        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const authString = `${clientId}:${clientSecret}`;
        const encodedAuth = Buffer.from(authString).toString('base64');

        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
            headers: {
                'Authorization': `Basic ${encodedAuth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch subscription details');
        }
        
        if (data.status === "ACTIVE") {
            res.json({ status: "ACTIVE" });
        } else {
            res.json({ status: "INACTIVE" });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default {
    createOrder,
    captureOrder,
    createProduct,
    createPlan,
    cancelSubscription,
    checkSubscriptionIsValid
}