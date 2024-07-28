import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import {
    useCreateOrderMutation,
    useCaptureOrderMutation,
    useCreateProductMutation,
    useCreatePlanMutation
} from"../../redux/payment/paymentApiSlice"
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../redux/auth/authSlice";
import {Typography} from "@mui/material";
import {
    selectCurrentAmount,
    selectCurrentIsSubscribing,
    selectCurrentIsYearlyPayment,
    selectCurrentItemId
} from "../../redux/payment/paymentSlice";
import {useUpdateUserMutation} from "../../redux/users/usersApiSlice";
import {useLazyGetPaymentItemByIdQuery} from "../../redux/payment/PaymentItemApiSlice";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

const PayPalButton = () => {
    const [createOrder] = useCreateOrderMutation()
    const [captureOrder] = useCaptureOrderMutation()
    const [createProduction] = useCreateProductMutation()
    const [createPlan] = useCreatePlanMutation()
    const [updateUser] = useUpdateUserMutation()
    const [getPaymentItemById] = useLazyGetPaymentItemByIdQuery()
    const userId = useSelector(selectCurrentUserId)
    const amount = useSelector(selectCurrentAmount)
    const itemId = useSelector(selectCurrentItemId)
    const isSubscribing = useSelector(selectCurrentIsSubscribing)
    const isYearlyPayment = useSelector(selectCurrentIsYearlyPayment)
    const navigate = useNavigate();
    const {t} = useTranslation();
    
    const handleCreateOrder = async (data, actions) => {
        try {
            const response = await createOrder({ amount: amount, itemId: itemId }).unwrap();
            return response.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Failed to create order');
        }
    };

    const onOrderApprove = async (data, actions) => {
        try {
            const captureData = await captureOrder({ orderID: data.orderID, userID: userId, amount: amount }).unwrap();
        } catch (error) {
            alert(t("pricing.onOrderApproveNo"));
        }
        alert(t("pricing.onOrderApproveOk"));
        navigate('/profile')
        toast.success("Order success!")
        window.location.reload();
    };

    const handleCreateSubscription = async (data, actions) => {
        const createProductionResponse = await createProduction({itemId: itemId})
        const createPlanResponse = await createPlan({itemId: itemId, productId: createProductionResponse.data.id, isAnnualPayment: isYearlyPayment})
        return actions.subscription.create({
            'plan_id': createPlanResponse.data.id // Creates the subscription
        });
    }

    const onSubscriptionApprove = async (data, actions) => {
        const item = await getPaymentItemById(itemId)
        if (item.data.name === "Basic") {
            updateUser({userId: userId, updateData: {subscriptionType: "BASIC", subscriptionId: data.subscriptionID }})
        } else if (item.data.name === "Premium") {
            updateUser({userId: userId, updateData: {subscriptionType: "PREMIUM", subscriptionId: data.subscriptionID }})
        }
        alert(t("pricing.onSubscriptionApprove") + data.subscriptionID);
        navigate('/profile')
        toast.success("Subscription success!")
        window.location.reload();
    }

    return (
        <>
            <PayPalScriptProvider options={{
                clientId: "AbeIMuvo2F_oTF3jl2qsdywXQH2q8BtbEo-hnbg0jxO3zAYOShGLPxso5xGFO_4L7JYcQkA19jLd25tq",
                currency: "EUR",
                vault: "true",
                ...(isSubscribing ? { intent: "subscription" } : { intent: "capture" })
            }}>
                {isSubscribing ?
                    <PayPalButtons key={`subscribing-${itemId}-${amount}`} createSubscription={handleCreateSubscription} onApprove={onSubscriptionApprove}/> :
                    <PayPalButtons key={`ordering-${itemId}`} createOrder={handleCreateOrder} onApprove={onOrderApprove}/>
                }
            </PayPalScriptProvider>
        </>
    );
};

export default PayPalButton;