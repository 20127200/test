const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
    let clientId = 'Adwet70povY5DGfENLTyrnVlUpgO8dnLHoiCuSaNzIVdlAI5wcYmJLO7mHoOWvpCh4Vud8xmBCjVzcUq'; // Replace with your actual client ID
    let clientSecret = 'EPAzQd2hwpW8oxc0V_T7rm_pPTvNTRvWUnSRr8GIqsD59YZy-yBM5Ex_8JISpVhxD_g8PcGlN5lpIi1Z'; // Replace with your actual client secret
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };