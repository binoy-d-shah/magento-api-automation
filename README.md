# Magento API Testing with TypeScript

This repository contains automated API tests for Magento's user management system using Playwright and TypeScript. It demonstrates best practices for API testing, including reusable functions, test data generation, and error handling.

## Project Overview

- **Framework**: Playwright
- **Programming Language**: TypeScript
- **API Endpoints Tested**: 
    - Customer Registration
    - User Login
    - User Profile Management
- **Linting**: ESLint for code quality and style enforcement
- **Test Data Generation**: Faker.js for generating random user data
- **Test Execution**: Run tests using Playwright Test Runner

## Prerequisites

Before you begin, ensure that you have the following installed:

1. **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
2. **npm** (Node Package Manager) - Comes with Node.js

## Getting Started

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/binoy-d-shah/magento-api-automation.git
cd magento-api-automation
```

### 2. Install Dependencies

Install the necessary dependencies:

```bash
npm install
```

This will install:
- Playwright for browser automation
- Faker.js for generating random data
- Other utilities like `@playwright/test`, `@types/node`, etc.

### 3. Set Up Configuration

You need to provide configuration values like the base URL for the API and the admin token.

1. Create a `.env` file in the root of the project:

```bash
touch .env
```

2. Add the following configuration to the `.env` file:

```
BASE_URL=https://magento.softwaretestingboard.com/rest/default/V1
ADMIN_TOKEN=your_admin_token_here
```

Replace `your_admin_token_here` with your actual admin token from Magento.

3. Linting Setup

This project uses ESLint to ensure code quality and maintain coding standards.

- **Install ESLint dependencies:** Already covered in npm install.
- **Run ESLint:** You can run ESLint manually using the following command:

```bash
npx eslint . --ext .ts
```

- **Automatically Fix Linting Issues:** You can automatically fix linting issues on file save in VSCode by enabling the eslint.autoFixOnSave setting in VSCode settings.

### 4. Run Tests

You can run the Playwright tests using the following command:

```bash
npx playwright test
```

This will execute all the test cases in the project.

- **Run Specific Test**: You can also run a specific test by specifying its file:

```bash
npx playwright test path/to/test-file.ts
```

### 5. Code Structure

Here’s an overview of the project structure:

```
.
├── src
│   ├── apiHelpers.ts          # Contains API request functions
│   ├── userGenerator.ts       # Contains function for generating random user data
│   └── config.ts              # Stores configuration variables (like base URL and admin token)
├── tests
│   ├── userLogin.spec.ts      # Test cases for user login
│   ├── userProfile.spec.ts    # Test cases for user profile management
│   ├── userRegistration.spec.ts  # Test cases for user registration
├── .env                       # Stores environment-specific variables like base URL and token
├── package.json               # Project dependencies and scripts
├── playwright.config.ts       # Playwright configuration file
└── README.md                  # Project documentation
```

### 6. Test Suite Structure

The tests are organized into different suites based on the API being tested:

1. **User Registration Tests (`userRegistration.spec.ts`)**
   - Test cases for creating a new customer account using the API.

2. **User Login Tests (`userLogin.spec.ts`)**
   - Test cases for logging in a customer using the API.

3. **User Profile Management Tests (`userProfile.spec.ts`)**
   - Test cases for managing the user's profile, including retrieving the profile via the API.

### 7. Code Quality & Best Practices
1. **Modular Code:** Reusable functions for API requests (createCustomer, loginUser, etc.) and random data generation.

2. **Test Data Generation:** faker.js is used to generate random user data for each test run to ensure variability and test coverage.

3. **Documentation:** Each function and test is documented using JSDoc comments for clarity and ease of understanding.

### 8. Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)