import { clerkClient } from "@clerk/express";

// Middleware for    Educator Routes 
export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const response = await clerkClient.users.getUser(userId);

        if (response.publicMetadata.role !== 'educator') {
            return res.json({ success: false, message: 'Unauthorized Access' });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
// middleware/clerkAuth.js
// import { requireAuth } from '@clerk/clerk-express';

// export const clerkMiddleware = requireAuth({
//   unauthorizedHandler: (req, res) => {
//     return res.status(401).json({ success: false, message: 'Unauthorized' });
//   }
// });


