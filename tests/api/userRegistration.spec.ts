import { test, expect, request, APIRequestContext } from '@playwright/test';
import { generateRandomUser } from '../../utils/userGenerator';
import { createCustomer } from '../../utils/apiHelpers';
import { config } from '../../utils/config';

/**
 * Test Suite for User Registration API
 *
 * This suite validates the customer registration API by verifying 
 * positive and negative test scenarios.
 */
test.describe('User Registration API Tests', () => {
    
    let apiContext: APIRequestContext;
    let randomUser: { email: string; firstname: string; lastname: string; password: string };
    const baseUrl = config.baseUrl;
    const adminToken = config.adminToken;

    /**
     * Before all tests, set up an API request context and generate a random test user.
     */
    test.beforeAll(async ({ playwright }) => {
        apiContext = await request.newContext();
        randomUser = generateRandomUser();
    });

    /**
     * Test Case: Successfully create a new customer account
     *
     * - Sends a request with valid customer details.
     * - Expects a 200 response status.
     * - Validates that the response contains expected user information.
     */
    test('should create a new customer account with random data', async () => {
        const response = await createCustomer(apiContext, baseUrl, adminToken, randomUser);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('id');
        expect(responseBody.email).toBe(randomUser.email);
        expect(responseBody.firstname).toBe(randomUser.firstname);
        expect(responseBody.lastname).toBe(randomUser.lastname);
        expect(responseBody).toHaveProperty('created_at');
        expect(responseBody).toHaveProperty('updated_at');
        expect(responseBody.addresses[0].street[0]).toBe('123 Oak Ave');
        expect(responseBody.addresses[0].city).toBe('Purchase');
        expect(responseBody.addresses[0].region.region).toBe('New York');
        expect(responseBody.addresses[0].postcode).toBe('10755');
        expect(responseBody.addresses[0].telephone).toBe('512-555-1111');
    });

    /**
     * Test Case: Attempt to create an account with an already registered email
     *
     * - Uses an existing email for registration.
     * - Expects a 400 response status.
     * - Validates that the API returns a meaningful error message.
     */
    test('should not create a customer account with an already used email', async () => {
        const randomUser = { email: 'jdoe@example.com', firstname: 'Jane', lastname: 'Doe', password: 'Password1' };
        const response = await createCustomer(apiContext, baseUrl, adminToken, randomUser);
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain('A customer with the same email address already exists in an associated website.');
    });

    /**
     * Test Case: Attempt to create an account with missing required fields
     *
     * - Sends a request without an email field.
     * - Expects a 400 response status.
     * - Validates the error message for missing email.
     */
    test('should not create a customer account with missing required fields', async () => {
        const invalidUser = { email: '', firstname: 'John', lastname: 'Doe', password: 'Password1' };
        const response = await createCustomer(apiContext, baseUrl, adminToken, invalidUser);
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain('The customer email is missing. Enter and try again.');
    });

    /**
     * Test Case: Attempt to create an account with an invalid email format
     *
     * - Uses an incorrectly formatted email.
     * - Expects a 400 response status.
     * - Validates the error message indicating an invalid email address.
     */
    test('should not create a customer account with invalid email format', async () => {
        const invalidUser = generateRandomUser();
        invalidUser.email = 'invalid-email';
        invalidUser.password = 'Password1';
        const response = await createCustomer(apiContext, baseUrl, adminToken, invalidUser);
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain('is not a valid email address.');
    });

    /**
     * Test Case: Attempt to create an account with an invalid password format
     *
     * - Uses a weak password that does not meet security requirements.
     * - Expects a 400 response status.
     * - Validates the error message related to password strength.
     */
    test('should not create a customer with a invalid password format', async () => {
        const weakPasswordUser = generateRandomUser();
        weakPasswordUser.password = '123';
        const response = await createCustomer(apiContext, baseUrl, adminToken, weakPasswordUser);
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain('The password needs at least %1 characters. Create a new password and try again.');
    });
});
