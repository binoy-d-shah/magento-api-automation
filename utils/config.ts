import dotenv from 'dotenv';

dotenv.config();

export const config = {
    baseUrl: process.env.BASE_URL || 'https://magento.softwaretestingboard.com/rest/default/V1',
    adminToken: process.env.ADMIN_TOKEN || 'your_admin_token_here',
};