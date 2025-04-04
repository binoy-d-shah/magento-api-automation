import { test, expect, request, APIRequestContext } from '@playwright/test';
import { generateRandomUser } from '../../utils/userGenerator';
import { createCustomer, loginUser, getUserProfile } from '../../utils/apiHelpers';
import { config } from '../../utils/config';

/**
 * Test Suite for User Profile Management API
 * 
 * This suite validates the retrieval of user profile details.
 * It ensures correct authentication and access control mechanisms.
 */
test.describe('User Profile Management API Tests', () => {

    let apiContext: APIRequestContext;
    let testUser: { email: string; firstname: string; lastname: string; password: string };
    let customerToken: string;

    /**
     * Before all tests, set up an API request context, generate a test user,
     * register the user, and retrieve an authentication token.
     */
    test.beforeAll(async ({ playwright }) => {
        apiContext = await request.newContext();
        testUser = generateRandomUser();
        
        // Step 1: Create a new customer
        await createCustomer(apiContext, config.baseUrl, config.adminToken, testUser);
        
        // Step 2: Login and get customer token
        const loginResponse = await loginUser(apiContext, config.baseUrl, testUser.email, testUser.password);
        expect(loginResponse.status()).toBe(200);
        customerToken = (await loginResponse.text()).replaceAll('"', '');
        expect(customerToken).toBeTruthy();
    });

    /**
     * TC-10: Retrieve User Profile Successfully
     * 
     * - Sends a request to fetch the user profile using a valid token.
     * - Expects a 200 response status.
     * - Validates that the returned profile details match the registered user.
     */
    test('should retrieve user profile successfully', async () => {

        const response = await getUserProfile(apiContext, config.baseUrl, customerToken);
        expect(response.status()).toBe(200);

        const userProfile = await response.json();
        expect(userProfile.email).toBe(testUser.email);
        expect(userProfile.firstname).toBe(testUser.firstname);
        expect(userProfile.lastname).toBe(testUser.lastname);
    });

    /**
     * TC-11: Unauthorized Access with Invalid Token
     * 
     * - Sends a request with an invalid authentication token.
     * - Expects a 401 response status.
     * - Validates that the request is denied due to unauthorized access.
     */
    test('should return 401 for an invalid token', async () => {

        const response = await getUserProfile(apiContext, config.baseUrl, 'invalidToken');
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody.message).toContain('The consumer isn\'t authorized to access %resources.');
    });
});