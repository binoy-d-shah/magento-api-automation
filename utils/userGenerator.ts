import { faker } from '@faker-js/faker';

/**
 * Generates a random user object with realistic test data.
 * This function uses the Faker.js library to create unique values.
 *
 * @returns {Object} A randomly generated user object.
 * @returns {string} user.email - A unique, randomly generated email address in lowercase.
 * @returns {string} user.firstname - A randomly generated first name.
 * @returns {string} user.lastname - A randomly generated last name.
 * @returns {string} user.password - A randomly generated secure password.
 *
 * @example
 * const newUser = generateRandomUser();
 * console.log(newUser);
 * // Output:
 * // {
 * //   email: "john.doe@example.com",
 * //   firstname: "John",
 * //   lastname: "Doe",
 * //   password: "securePass123"
 * // }
 */
export function generateRandomUser() {
    return {
        email: faker.internet.email().toLowerCase(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        password: faker.internet.password()
    };
}
