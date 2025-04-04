import { test, expect, request, APIRequestContext } from '@playwright/test';
import { generateRandomUser } from '../../utils/userGenerator';
import { createCustomer, loginUser } from '../../utils/apiHelpers';
import { config } from '../../utils/config';

/**
 * Test Suite for User Login API
 * 
 * This suite tests various login scenarios using the Magento API.
 * It ensures correct authentication behavior for valid and invalid credentials.
 */
test.describe('User Login API Tests', () => {
    
    let apiContext: APIRequestContext;
    let testUser: { email: string; firstname: string; lastname: string; password: string };

    /**
     * Before all tests, create an API request context and register a new test user.
     * This user will be used for login validation tests.
     */
    test.beforeAll(async ({ playwright }) => {
        apiContext = await request.newContext();
        testUser = generateRandomUser();
        
        // Create a user account before testing login
        await createCustomer(apiContext, config.baseUrl, config.adminToken, testUser);
    });

    /**
     * TC-06: Successful Login with Valid Credentials
     * 
     * - Sends a login request using a valid email and password.
     * - Expects a 200 response status.
     * - Validates that a valid token is returned.
     */
    test('should login successfully with valid credentials', async () => {
        const response = await loginUser(apiContext, config.baseUrl, testUser.email, testUser.password);
        expect(response.status()).toBe(200);
        
        const token = await response.text();
        expect(token).toBeTruthy();
    });

    /**
     * TC-07: Login Failure with Incorrect Password
     * 
     * - Sends a login request with the correct email but an incorrect password.
     * - Expects a 401 response status.
     * - Validates that the response contains an appropriate error message.
     */
    test('should not login with incorrect password', async () => {
        const response = await loginUser(apiContext, config.baseUrl, testUser.email, 'WrongPass123');
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody.message).toContain('The account sign-in was incorrect');
    });

    /**
     * TC-08: Login Failure with Unregistered Email
     * 
     * - Attempts to log in using an email that is not registered in the system.
     * - Expects a 401 response status.
     * - Validates that the response contains an appropriate error message.
     */
    test('should not login with an unregistered email', async () => {
        const response = await loginUser(apiContext, config.baseUrl, 'unregistered@example.com', 'Password123!');
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody.message).toContain('The account sign-in was incorrect');
    });

    /**
     * TC-09: Login Failure with Empty Credentials
     * 
     * - Attempts to log in with an empty email and password.
     * - Expects a 400 response status.
     * - Validates that the response contains an appropriate error message.
     */
    test('should not login with empty credentials', async () => {
        const response = await loginUser(apiContext, config.baseUrl, '', '');
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody.message).toContain('One or more input exceptions have occurred.');
    });
});