import paypal from "@paypal/checkout-server-sdk";

function environment() {
    let clientId = process.env.CLIENT_ID
    let clientSecret = process.env.CLIENT_SECRET

    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

export default {client};