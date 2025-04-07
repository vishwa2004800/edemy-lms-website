import { Webhook } from "svix";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Courses.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });
        
        const { data, type } = req.body;
        
        switch (type) { 
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address, 
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url, 
                };
                await User.create(userData);
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address, 
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url, 
                };
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                break;
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Clerk webhook error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const stripeInstance = new Stripe('sk_test_51R5jpoQTRj7mdw5VYBN50aRjDi6JqnERzUGllMzRZiVmNw8BCpj0xnzce5q4QXk4Huvy9wEM76bVmriNeYtdicD400Tv5K2Ila');

export const stripeWebhooks = async (req, res) => {
    let event;
    try {
        // Get the signature from headers
        const signature = req.headers['stripe-signature'];
        
        // Verify the event
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            // user controller ma jo
            'whsec_b2bZeJEvt14ICpXWBxMWQwyPzkwKJmOH'
        );
        
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { purchaseId } = session.metadata;

                if (!purchaseId) {
                    throw new Error('Missing purchaseId in session metadata');
                }

                // Find and update purchase
                const purchase = await Purchase.findById(purchaseId);
                if (!purchase) {
                    throw new Error('Purchase not found');
                }

                // Find user and course
                const [user, course] = await Promise.all([
                    User.findById(purchase.userId),
                    Course.findById(purchase.courseId)
                ]);

                if (!user || !course) {
                    throw new Error('User or Course not found');
                }

                // Update enrollments
                if (!course.enrolledStudents.includes(user._id)) {
                    course.enrolledStudents.push(user._id);
                }

                if (!user.enrolledCourses.includes(course._id)) {
                    user.enrolledCourses.push(course._id);
                }

                // Update purchase status
                purchase.status = 'Completed';

                // Save all changes
                await Promise.all([
                    course.save(),
                    user.save(),
                    purchase.save()
                ]);

                break;
            }
            
            case 'checkout.session.expired': {
                const session = event.data.object;
                const { purchaseId } = session.metadata;
                
                if (purchaseId) {
                    await Purchase.findByIdAndUpdate(purchaseId, { status: 'Failed' });
                }
                break;
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};