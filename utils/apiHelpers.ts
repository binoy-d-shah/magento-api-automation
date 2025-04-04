import { APIRequestContext } from '@playwright/test';

/**
 * Registers a new customer via Magento API.
 *
 * @param {APIRequestContext} apiContext - The Playwright API request context.
 * @param {string} baseUrl - The base URL of the Magento API.
 * @param {string} adminToken - The admin authentication token required for customer creation.
 * @param {Object} user - The user details for registration.
 * @param {string} user.email - The email address of the new customer.
 * @param {string} user.firstname - The first name of the new customer.
 * @param {string} user.lastname - The last name of the new customer.
 * @param {string} user.password - The password for the new customer.
 * @returns {Promise<APIResponse>} The API response object containing customer details or error message.
 */
export async function createCustomer(
    apiContext: APIRequestContext,
    baseUrl: string,
    adminToken: string,
    user: { email: string; firstname: string; lastname: string; password: string }
) {
    return apiContext.post(`${baseUrl}/customers`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        data: {
            customer: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                addresses: [{
                    defaultShipping: true,
                    defaultBilling: true,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    region: {
                        regionCode: 'NY',
                        region: 'New York',
                        regionId: 43
                    },
                    postcode: '10755',
                    street: ['123 Oak Ave'],
                    city: 'Purchase',
                    telephone: '512-555-1111',
                    countryId: 'US'
                }]
            },
            password: user.password
        }
    });
}

/**
 * Authenticates an existing customer and retrieves an access token.
 *
 * @param {APIRequestContext} apiContext - The Playwright API request context.
 * @param {string} baseUrl - The base URL of the Magento API.
 * @param {string} email - The customer's email address.
 * @param {string} password - The customer's password.
 * @returns {Promise<APIResponse>} The API response object containing the authentication token or an error message.
 */
export async function loginUser(apiContext: APIRequestContext, baseUrl: string, email: string, password: string) {
    return apiContext.post(`${baseUrl}/integration/customer/token`, {
        headers: { 'Content-Type': 'application/json' },
        data: { username: email, password: password }
    });
}

/**
 * Retrieves the profile details of an authenticated customer.
 *
 * @param {APIRequestContext} apiContext - The Playwright API request context.
 * @param {string} baseUrl - The base URL of the Magento API.
 * @param {string} customerToken - The authentication token of the customer.
 * @returns {Promise<APIResponse>} The API response object containing customer profile details or an error message.
 */
export async function getUserProfile(apiContext: APIRequestContext, baseUrl: string, customerToken: string) {
    return apiContext.get(`${baseUrl}/customers/me`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${customerToken}`,
        },
    });
}
