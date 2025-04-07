// // // import User from "../models/User.js"
// // // import Stripe from 'stripe';
// // // import {Purchase} from '../models/Purchase.js'
// // // import Course from '../models/Courses.js'
// // // import { CourseProgress } from "../models/CourseProgress.js";
// // // export const getUserData = async (req, res) => {
// // //     try {
// // //         const userId = req.auth.userId
// // //         const user = await User.findById(userId)

// // //         if (!user) {
// // //             return res.json({ success: false, message: 'User Not Found' })
// // //         }

// // //         res.json({ success: true, user })
// // //     } catch (error) {
// // //         res.json({ success: false, message: error.message })
// // //     }
// // // }
// // // // Users Enrolled Courses With Lecture Links
// // // export const userEnrolledCourses = async (req, res) => {
// // //     try {
// // //         const userId = req.auth.userId
// // //         const userData = await User.findById(userId).populate('enrolledCourses')

// // //         res.json({ success: true, enrolledCourses: userData.enrolledCourses })
// // //     } catch (error) {
// // //         res.json({ success: false, message: error.message })
// // //     }
// // // }


// // // // purchase course
// // // export const purchaseCourse = async (req, res) => {
// // //     try {
// // //         const { courseId } = req.body
// // //         const { origin } = req.headers
// // //         const userId = req.auth.userId
// // //         const userData = await User.findById(userId)
// // //         const courseData = await Course.findById(courseId)

// // //         if(!userData || !courseData){
// // //             return res.json({ success: false, message: 'Data Not Found' })
// // //         }

// // //         const purchaseData = {
// // //             courseId:courseData._id,
// // //             userId,
// // //             amount:(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
// // //         }

// // //         const newPurchase = await Purchase.create(purchaseData)

// // //         // stripe gateway
// // //         const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

// // //         const currency = process.env.CURRENCY.toLowerCase()

// // //         // Creating line items to for Stripe
// // //         const line_items = [{
// // //              price_data: {
// // //                     currency,
// // //                     product_data: {
// // //                     name: courseData.courseTitle
// // //         },
// // //         unit_amount: Math.floor(newPurchase.amount) * 100
// // //     },
// // //     quantity: 1
// // // }];

// // // // payment session
// // //   const session = await stripeInstance.checkout.sessions.create({
// // //     success_url:`${origin}/loading/myenroll`,
// // //     cancel_url:`${origin}/`,
// // //     line_items:line_items,
// // //     mode:'payment',
// // //     //metadata
// // //     metadata:{
// // //         purchaseId: newPurchase._id.toString()
// // //     }
// // //   })
// // //   console.log('Stripe Session:', session);


// // //   res.json({success:true,session_url:session.url})


// // //     } catch (error) {
// // //         res.json({success:false,message:error.message})

// // //     }
// // // }

// // // // update user course progress
// // // export const updateUserCourseProgress = async (req, res) => {
// // //     try {
// // //         const userId = req.auth.userId
// // //         const { courseId, lectureId } = req.body
// // //         const progressData = await CourseProgress.findOne({ userId, courseId })

// // //         if(progressData){
// // //             if(progressData.lectureCompleted.includes(lectureId)){
// // //                 return res.json({ success: true, message: 'Lecture Already Completed' })
// // //             }

// // //             progressData.lectureCompleted.push(lectureId)
// // //             await progressData.save()
// // //         }
// // //         else{
// // //             await CourseProgress.create({
// // //                 userId,
// // //                 courseId,
// // //                 lectureCompleted:[lectureId]
// // //             })
// // //         }

// // //         res.json({sucess:true,message:'Progress Updated'})
// // //     } catch (error) {
// // //         res.json({success:false,message:error.message})
// // //     }
// // // }

// // // // get User Course Progress
// // // export const getUserCourseProgress = async (req, res) =>{
// // //     try {
// // //         const userId = req.auth.userId
// // //         const { courseId } = req.body
// // //         const progressData = await CourseProgress.findOne({userId, courseId })
// // //         res.json({success: true, progressData})
// // //     } catch (error) {
// // //         res.json({ success: false, message: error.message })
// // //     }
// // // }

// // // export const handlePayPalSuccess = async (details) => {
// // //     try {
// // //         const token = await getToken();
// // //         const response = await axios.post(
// // //           `${backendUrl}/api/user/purchase/paypal-success`,  // Fixed string interpolation
// // //           {
// // //             courseId: courseData._id,
// // //             paymentId: details.id,
// // //             paymentStatus: details.status,
// // //           },
// // //           {
// // //             headers: { Authorization: `Bearer ${token}` },  // Fixed Bearer token format
// // //           }
// // //         );

// // //         if (response.data.success) {
// // //             toast.success("Course enrolled successfully!");
// // //             setIsEnrolled(true);
// // //         }
// // //     } catch (error) {
// // //         toast.error("Failed to verify payment");
// // //     }
// // // };


// // // // Add user rating function
// // // export const addUserRating = async (req, res)=>{
// // //     const userId = req.auth.userId;
// // //     const { courseId, rating } = req.body;

// // //     if(!courseId || !userId || !rating || rating < 1 || rating > 5){
// // //         return res.json({ success: false, message: 'InValid Details' });
// // //     }

// // //     try {
// // //         const course = await Course.findById(courseId);

// // //         if(!course){
// // //             return res.json({ success: false, message: 'Course not found.' });
// // //         }
// // //         const user = await User.findById(userId);
// // //         if(!user || !user.enrolledCourses.includes(courseId))
// // //         {
// // //                 return res.json({success:false,message:'User has not purchased this course'})
// // //         }
// // //         const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

// // //         if(existingRatingIndex > -1){
// // //             course.courseRatings[existingRatingIndex].rating = rating;
// // //         }else{
// // //             course.courseRatings.push({userId, rating});
// // //         }
// // //         await course.save();

// // //         return res.json({success: true, message: 'Rating added'})

// // //     } catch (error) {

// // //         return res.json({success:false, message:error.message})
// // //     }
// // // }




// // import User from "../models/User.js";
// // import { Purchase } from '../models/Purchase.js';
// // import Course from '../models/Courses.js';
// // import { CourseProgress } from "../models/CourseProgress.js";
// // import Razorpay from "razorpay";

// // export const getUserData = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const user = await User.findById(userId);

// //         if (!user) {
// //             return res.json({ success: false, message: 'User Not Found' });
// //         }

// //         res.json({ success: true, user });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const userEnrolledCourses = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const userData = await User.findById(userId).populate('enrolledCourses');
// //         res.json({ success: true, enrolledCourses: userData.enrolledCourses });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const purchaseCourse = async (req, res) => {
// //     try {
// //         const { courseId } = req.body;
// //         const userId = req.auth.userId;
// //         const userData = await User.findById(userId);
// //         const courseData = await Course.findById(courseId);

// //         if (!userData || !courseData) {
// //             return res.json({ success: false, message: 'Data Not Found' });
// //         }

// //         const amount = (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2);

// //         const razorpay = new Razorpay({
// //             key_id: process.env.RAZORPAY_KEY_ID,
// //             key_secret: process.env.RAZORPAY_KEY_SECRET,
// //         });

// //         const options = {
// //             amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise)
// //             currency: "INR",
// //             receipt: `order_${Date.now()}`,
// //         };

// //         const order = await razorpay.orders.create(options);

// //         // Create a pending purchase record
// //         const purchaseData = {
// //             courseId: courseData._id,
// //             userId,
// //             amount: amount,
// //             razorpayOrderId: order.id
// //         };

// //         const newPurchase = await Purchase.create(purchaseData);

// //         res.json({
// //             success: true,
// //             order,
// //             purchaseId: newPurchase._id,
// //             key_id: process.env.RAZORPAY_KEY_ID
// //         });

// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const verifyPayment = async (req, res) => {
// //     try {
// //         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseId } = req.body;

// //         // Verify the payment signature
// //         const generated_signature = crypto
// //             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
// //             .update(razorpay_order_id + "|" + razorpay_payment_id)
// //             .digest('hex');

// //         if (generated_signature === razorpay_signature) {
// //             // Payment is successful, update the purchase status
// //             const purchase = await Purchase.findById(purchaseId);
// //             if (!purchase) {
// //                 return res.json({ success: false, message: 'Purchase not found' });
// //             }

// //             // Update purchase status
// //             purchase.status = 'completed';
// //             purchase.razorpayPaymentId = razorpay_payment_id;
// //             await purchase.save();

// //             // Update user and course data
// //             const user = await User.findById(purchase.userId);
// //             const course = await Course.findById(purchase.courseId);

// //             if (!user.enrolledCourses.includes(course._id)) {
// //                 user.enrolledCourses.push(course._id);
// //                 await user.save();
// //             }

// //             if (!course.enrolledStudents.includes(user._id)) {
// //                 course.enrolledStudents.push(user._id);
// //                 await course.save();
// //             }

// //             res.json({ success: true, message: 'Payment verified successfully' });
// //         } else {
// //             res.json({ success: false, message: 'Invalid signature' });
// //         }
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const updateUserCourseProgress = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const { courseId, lectureId } = req.body;
// //         const progressData = await CourseProgress.findOne({ userId, courseId });

// //         if (progressData) {
// //             if (progressData.lectureCompleted.includes(lectureId)) {
// //                 return res.json({ success: true, message: 'Lecture Already Completed' });
// //             }

// //             progressData.lectureCompleted.push(lectureId);
// //             await progressData.save();
// //         } else {
// //             await CourseProgress.create({
// //                 userId,
// //                 courseId,
// //                 lectureCompleted: [lectureId]
// //             });
// //         }

// //         res.json({ success: true, message: 'Progress Updated' });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const getUserCourseProgress = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const { courseId } = req.body;
// //         const progressData = await CourseProgress.findOne({ userId, courseId });
// //         res.json({ success: true, progressData });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const addUserRating = async (req, res) => {
// //     const userId = req.auth.userId;
// //     const { courseId, rating } = req.body;

// //     if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
// //         return res.json({ success: false, message: 'Invalid Details' });
// //     }

// //     try {
// //         const course = await Course.findById(courseId);

// //         if (!course) {
// //             return res.json({ success: false, message: 'Course not found.' });
// //         }

// //         const user = await User.findById(userId);
// //         if (!user || !user.enrolledCourses.includes(courseId)) {
// //             return res.json({ success: false, message: 'User has not purchased this course' });
// //         }

// //         const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

// //         if (existingRatingIndex > -1) {
// //             course.courseRatings[existingRatingIndex].rating = rating;
// //         } else {
// //             course.courseRatings.push({ userId, rating });
// //         }
// //         await course.save();

// //         return res.json({ success: true, message: 'Rating added' });
// //     } catch (error) {
// //         return res.json({ success: false, message: error.message });
// //     }
// // };

// // import User from "../models/User.js";
// // import { Purchase } from '../models/Purchase.js';
// // import Course from '../models/Courses.js';
// // import { CourseProgress } from "../models/CourseProgress.js";
// // import crypto from 'crypto';

// // export const getUserData = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const user = await User.findById(userId);

// //         if (!user) {
// //             return res.json({ success: false, message: 'User Not Found' });
// //         }

// //         res.json({ success: true, user });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const userEnrolledCourses = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const userData = await User.findById(userId).populate('enrolledCourses');
// //         res.json({ success: true, enrolledCourses: userData.enrolledCourses });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const purchaseCourse = async (req, res) => {
// //     try {
// //         const { courseId } = req.body;
// //         const userId = req.auth.userId;
// //         const userData = await User.findById(userId);
// //         const courseData = await Course.findById(courseId);

// //         if (!userData || !courseData) {
// //             return res.json({ success: false, message: 'Data Not Found' });
// //         }

// //         const amount = (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2);

// //         // Create a pending purchase record
// //         const purchaseData = {
// //             courseId: courseData._id,
// //             userId,
// //             amount: amount
// //         };

// //         const newPurchase = await Purchase.create(purchaseData);

// //         // Generate PayU hash
// //         const merchantKey = process.env.PAYU_MERCHANT_KEY;
// //         const salt = process.env.PAYU_SALT;
// //         const txnId = `TXN_${Date.now()}`;
// //         const productInfo = courseData.courseTitle;
// //         const firstName = userData.name.split(' ')[0];
// //         const email = userData.email;
// //         const udf5 = newPurchase._id.toString(); // Store purchase ID for reference

// //         const hashString = `${merchantKey}|${txnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${salt}`;
// //         const hash = crypto.createHash('sha512').update(hashString).digest('hex');

// //         res.json({
// //             success: true,
// //             payuData: {
// //                 key: merchantKey,
// //                 txnid: txnId,
// //                 amount: amount,
// //                 productinfo: productInfo,
// //                 firstname: firstName,
// //                 email: email,
// //                 phone: "9999999999", // Add user's phone if available
// //                 surl: `${process.env.FRONTEND_URL}/payment-success`,
// //                 furl: `${process.env.FRONTEND_URL}/payment-failure`,
// //                 hash: hash,
// //                 udf5: udf5
// //             }
// //         });

// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const verifyPayment = async (req, res) => {
// //     try {
// //         const {
// //             txnid,
// //             mihpayid,
// //             status,
// //             hash,
// //             udf5 // Purchase ID
// //         } = req.body;

// //         // Verify hash
// //         const reverseHash = crypto.createHash('sha512')
// //             .update(`${process.env.PAYU_SALT}|${status}|||||||||${udf5}|||||${process.env.PAYU_MERCHANT_KEY}`)
// //             .digest('hex');

// //         if (reverseHash !== hash) {
// //             return res.json({ success: false, message: 'Invalid payment signature' });
// //         }

// //         const purchase = await Purchase.findById(udf5);
// //         if (!purchase) {
// //             return res.json({ success: false, message: 'Purchase not found' });
// //         }

// //         if (status === 'success') {
// //             // Update purchase status
// //             purchase.status = 'completed';
// //             purchase.payuTransactionId = txnid;
// //             purchase.payuPaymentId = mihpayid;
// //             await purchase.save();

// //             // Update user and course data
// //             const user = await User.findById(purchase.userId);
// //             const course = await Course.findById(purchase.courseId);

// //             if (!user.enrolledCourses.includes(course._id)) {
// //                 user.enrolledCourses.push(course._id);
// //                 await user.save();
// //             }

// //             if (!course.enrolledStudents.includes(user._id)) {
// //                 course.enrolledStudents.push(user._id);
// //                 await course.save();
// //             }

// //             res.json({ success: true, message: 'Payment verified successfully' });
// //         } else {
// //             purchase.status = 'failed';
// //             await purchase.save();
// //             res.json({ success: false, message: 'Payment failed' });
// //         }
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const updateUserCourseProgress = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const { courseId, lectureId } = req.body;
// //         const progressData = await CourseProgress.findOne({ userId, courseId });

// //         if (progressData) {
// //             if (progressData.lectureCompleted.includes(lectureId)) {
// //                 return res.json({ success: true, message: 'Lecture Already Completed' });
// //             }

// //             progressData.lectureCompleted.push(lectureId);
// //             await progressData.save();
// //         } else {
// //             await CourseProgress.create({
// //                 userId,
// //                 courseId,
// //                 lectureCompleted: [lectureId]
// //             });
// //         }

// //         res.json({ success: true, message: 'Progress Updated' });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const getUserCourseProgress = async (req, res) => {
// //     try {
// //         const userId = req.auth.userId;
// //         const { courseId } = req.body;
// //         const progressData = await CourseProgress.findOne({ userId, courseId });
// //         res.json({ success: true, progressData });
// //     } catch (error) {
// //         res.json({ success: false, message: error.message });
// //     }
// // };

// // export const addUserRating = async (req, res) => {
// //     const userId = req.auth.userId;
// //     const { courseId, rating } = req.body;

// //     if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
// //         return res.json({ success: false, message: 'Invalid Details' });
// //     }

// //     try {
// //         const course = await Course.findById(courseId);

// //         if (!course) {
// //             return res.json({ success: false, message: 'Course not found.' });
// //         }

// //         const user = await User.findById(userId);
// //         if (!user || !user.enrolledCourses.includes(courseId)) {
// //             return res.json({ success: false, message: 'User has not purchased this course' });
// //         }

// //         const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

// //         if (existingRatingIndex > -1) {
// //             course.courseRatings[existingRatingIndex].rating = rating;
// //         } else {
// //             course.courseRatings.push({ userId, rating });
// //         }
// //         await course.save();

// //         return res.json({ success: true, message: 'Rating added' });
// //     } catch (error) {
// //         return res.json({ success: false, message: error.message });
// //     }
// // };








// import User from "../models/User.js"
// import { Purchase } from "../models/Purchase.js"
// import Course from "../models/Courses.js"
// import { CourseProgress } from "../models/CourseProgress.js"
// import crypto from "crypto"

// export const getUserData = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const user = await User.findById(userId)

//     if (!user) {
//       return res.json({ success: false, message: "User Not Found" })
//     }

//     res.json({ success: true, user })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const userEnrolledCourses = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const userData = await User.findById(userId).populate("enrolledCourses")
//     res.json({ success: true, enrolledCourses: userData.enrolledCourses })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const purchaseCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const userId = req.auth.userId
//     const userData = await User.findById(userId)
//     const courseData = await Course.findById(courseId)

//     if (!userData || !courseData) {
//       return res.json({ success: false, message: "Data Not Found" })
//     }

//     const amount = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)

//     // Create a pending purchase record
//     const purchaseData = {
//       courseId: courseData._id,
//       userId,
//       amount: amount,
//     }

//     const newPurchase = await Purchase.create(purchaseData)

//     // Generate PayU hash
//     const merchantKey = process.env.PAYU_MERCHANT_KEY
//     const salt = process.env.PAYU_SALT
//     const txnId = `TXN_${Date.now()}`
//     const productInfo = courseData.courseTitle
//     const firstName = userData.name.split(" ")[0]
//     const email = userData.email
//     const udf5 = newPurchase._id.toString() // Store purchase ID for reference

//     const hashString = `${merchantKey}|${txnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${salt}`
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex")

//     res.json({
//       success: true,
//       payuData: {
//         key: merchantKey,
//         txnid: txnId,
//         amount: amount,
//         productinfo: productInfo,
//         firstname: firstName,
//         email: email,
//         phone: "9999999999", // Add user's phone if available
//         surl: `${process.env.FRONTEND_URL}/payment-success`,
//         furl: `${process.env.FRONTEND_URL}/payment-failure`,
//         hash: hash,
//         udf5: udf5,
//       },
//     })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       txnid,
//       mihpayid,
//       status,
//       hash,
//       udf5, // Purchase ID
//     } = req.body

//     // Get the key and salt from environment variables
//     const key = process.env.PAYU_MERCHANT_KEY
//     const salt = process.env.PAYU_SALT

//     // Verify hash - use the correct format for reverse hash
//     const reverseHashString = `${salt}|${status}|||||${udf5}||||||${key}`
//     const reverseHash = crypto.createHash("sha512").update(reverseHashString).digest("hex")

//     if (reverseHash !== hash) {
//       return res.json({ success: false, message: "Invalid payment signature" })
//     }

//     const purchase = await Purchase.findById(udf5)
//     if (!purchase) {
//       return res.json({ success: false, message: "Purchase not found" })
//     }

//     if (status === "success") {
//       // Update purchase status
//       purchase.status = "completed"
//       purchase.payuTransactionId = txnid
//       purchase.payuPaymentId = mihpayid
//       await purchase.save()

//       // Update user and course data
//       const user = await User.findById(purchase.userId)
//       const course = await Course.findById(purchase.courseId)

//       if (!user.enrolledCourses.includes(course._id)) {
//         user.enrolledCourses.push(course._id)
//         await user.save()
//       }

//       if (!course.enrolledStudents.includes(user._id)) {
//         course.enrolledStudents.push(user._id)
//         await course.save()
//       }

//       res.json({ success: true, message: "Payment verified successfully" })
//     } else {
//       purchase.status = "failed"
//       await purchase.save()
//       res.json({ success: false, message: "Payment failed" })
//     }
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const updateUserCourseProgress = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const { courseId, lectureId } = req.body
//     const progressData = await CourseProgress.findOne({ userId, courseId })

//     if (progressData) {
//       if (progressData.lectureCompleted.includes(lectureId)) {
//         return res.json({ success: true, message: "Lecture Already Completed" })
//       }

//       progressData.lectureCompleted.push(lectureId)
//       await progressData.save()
//     } else {
//       await CourseProgress.create({
//         userId,
//         courseId,
//         lectureCompleted: [lectureId],
//       })
//     }

//     res.json({ success: true, message: "Progress Updated" })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const getUserCourseProgress = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const { courseId } = req.body
//     const progressData = await CourseProgress.findOne({ userId, courseId })
//     res.json({ success: true, progressData })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const addUserRating = async (req, res) => {
//   const userId = req.auth.userId
//   const { courseId, rating } = req.body

//   if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
//     return res.json({ success: false, message: "Invalid Details" })
//   }

//   try {
//     const course = await Course.findById(courseId)

//     if (!course) {
//       return res.json({ success: false, message: "Course not found." })
//     }

//     const user = await User.findById(userId)
//     if (!user || !user.enrolledCourses.includes(courseId)) {
//       return res.json({ success: false, message: "User has not purchased this course" })
//     }

//     const existingRatingIndex = course.courseRatings.findIndex((r) => r.userId === userId)

//     if (existingRatingIndex > -1) {
//       course.courseRatings[existingRatingIndex].rating = rating
//     } else {
//       course.courseRatings.push({ userId, rating })
//     }
//     await course.save()

//     return res.json({ success: true, message: "Rating added" })
//   } catch (error) {
//     return res.json({ success: false, message: error.message })
//   }
// }











// import User from "../models/User.js"
// // import { Purchase } from "../models/Purchase.js"
// import Course from "../models/Courses.js"
// import { CourseProgress } from "../models/CourseProgress.js"
// import crypto from "crypto"

// // Add this debugging function to your controller
// const debugHash = (params) => {
//   const { key, txnid, amount, productinfo, firstname, email, udf5, salt } = params

//   // Log all parameters individually to check for unexpected characters
//   console.log("Key:", key)
//   console.log("TxnID:", txnid)
//   console.log("Amount:", amount)
//   console.log("Product Info:", productinfo)
//   console.log("First Name:", firstname)
//   console.log("Email:", email)
//   console.log("UDF5:", udf5)
//   console.log("Salt:", salt)

//   // Try different hash string formats
//   const format1 = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`
//   const format2 = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||${udf5}||||||${salt}`

//   console.log("Format 1:", format1)
//   console.log("Format 2:", format2)

//   const hash1 = crypto.createHash("sha512").update(format1).digest("hex")
//   const hash2 = crypto.createHash("sha512").update(format2).digest("hex")

//   console.log("Hash 1:", hash1)
//   console.log("Hash 2:", hash2)

//   return { format1, format2, hash1, hash2 }
// }

// export const getUserData = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const user = await User.findById(userId)

//     if (!user) {
//       return res.json({ success: false, message: "User Not Found" })
//     }

//     res.json({ success: true, user })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const userEnrolledCourses = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const userData = await User.findById(userId).populate("enrolledCourses")
//     res.json({ success: true, enrolledCourses: userData.enrolledCourses })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const purchaseCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const userId = req.auth.userId
//     const userData = await User.findById(userId)
//     const courseData = await Course.findById(courseId)

//     if (!userData || !courseData) {
//       return res.json({ success: false, message: "Data Not Found" })
//     }

//     const amount = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)

//     // Create a pending purchase record
//     const purchaseData = {
//       courseId: courseData._id,
//       userId,
//       amount: amount,
//     }

//     const newPurchase = await Purchase.create(purchaseData)

//     // Generate PayU hash
//     const merchantKey = process.env.PAYU_MERCHANT_KEY
//     const salt = process.env.PAYU_SALT
//     const txnId = `TXN_${Date.now()}`
//     const productInfo = courseData.courseTitle
//     const firstName = userData.name.split(" ")[0]
//     const email = userData.email
//     const udf5 = newPurchase._id.toString() // Store purchase ID for reference

//     // Make sure to properly handle any special characters in the parameters
//     const productInfoEncoded = encodeURIComponent(productInfo).replace(/%20/g, "+")
//     const hashString = `${merchantKey}|${txnId}|${amount}|${productInfoEncoded}|${firstName}|${email}|||||||||||${salt}`
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex")
//     // const hash = '293d07d01842a04311cc2d32523e936a6e3ad45734cbdb2b50ff66ad766e44900d71298d479eb29b2176c282474dd7575833e5d94179124b8fef6783b17f1fe0'

//     // In your purchaseCourse function, add this before returning the response:
//     const debugResult = debugHash({
//       key: merchantKey,
//       txnid: txnId,
//       amount: amount,
//       productinfo: productInfo,
//       firstname: firstName,
//       email: email,
//       udf5: udf5,
//       salt: salt,
//     })

//     console.log("Debug Hash Results:", debugResult)

//     res.json({
//       success: true,
//       payuData: {
//         key: merchantKey,
//         txnid: txnId,
//         amount: amount,
//         productinfo: productInfoEncoded, // Use the encoded product info
//         firstname: firstName,
//         email: email,
//         phone: userData.phone || "9999999999",
//         surl: `${process.env.FRONTEND_URL}/payment-success`,
//         furl: `${process.env.FRONTEND_URL}/payment-failure`,
//         hash: hash,
//         udf5: udf5,
//         service_provider: "payu_paisa",
//       },
//     })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       txnid,
//       mihpayid,
//       status,
//       hash,
//       udf5, // Purchase ID
//     } = req.body

//     // Get the key and salt from environment variables
//     const key = process.env.PAYU_MERCHANT_KEY
//     const salt = process.env.PAYU_SALT

//     // Verify hash - use the correct format for reverse hash
//     const reverseHashString = `${salt}|${status}|||||${udf5}||||||${key}`
//     const reverseHash = crypto.createHash("sha512").update(reverseHashString).digest("hex")

//     if (reverseHash !== hash) {
//       return res.json({ success: false, message: "Invalid payment signature" })
//     }

//     const purchase = await Purchase.findById(udf5)
//     if (!purchase) {
//       return res.json({ success: false, message: "Purchase not found" })
//     }

//     if (status === "success") {
//       // Update purchase status
//       purchase.status = "completed"
//       purchase.payuTransactionId = txnid
//       purchase.payuPaymentId = mihpayid
//       await purchase.save()

//       // Update user and course data
//       const user = await User.findById(purchase.userId)
//       const course = await Course.findById(purchase.courseId)

//       if (!user.enrolledCourses.includes(course._id)) {
//         user.enrolledCourses.push(course._id)
//         await user.save()
//       }

//       if (!course.enrolledStudents.includes(user._id)) {
//         course.enrolledStudents.push(user._id)
//         await course.save()
//       }

//       res.json({ success: true, message: "Payment verified successfully" })
//     } else {
//       purchase.status = "failed"
//       await purchase.save()
//       res.json({ success: false, message: "Payment failed" })
//     }
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const updateUserCourseProgress = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const { courseId, lectureId } = req.body
//     const progressData = await CourseProgress.findOne({ userId, courseId })

//     if (progressData) {
//       if (progressData.lectureCompleted.includes(lectureId)) {
//         return res.json({ success: true, message: "Lecture Already Completed" })
//       }

//       progressData.lectureCompleted.push(lectureId)
//       await progressData.save()
//     } else {
//       await CourseProgress.create({
//         userId,
//         courseId,
//         lectureCompleted: [lectureId],
//       })
//     }

//     res.json({ success: true, message: "Progress Updated" })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const getUserCourseProgress = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const { courseId } = req.body
//     const progressData = await CourseProgress.findOne({ userId, courseId })
//     res.json({ success: true, progressData })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

// export const addUserRating = async (req, res) => {
//   const userId = req.auth.userId
//   const { courseId, rating } = req.body

//   if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
//     return res.json({ success: false, message: "Invalid Details" })
//   }

//   try {
//     const course = await Course.findById(courseId)

//     if (!course) {
//       return res.json({ success: false, message: "Course not found." })
//     }

//     const user = await User.findById(userId)
//     if (!user || !user.enrolledCourses.includes(courseId)) {
//       return res.json({ success: false, message: "User has not purchased this course" })
//     }

//     const existingRatingIndex = course.courseRatings.findIndex((r) => r.userId === userId)

//     if (existingRatingIndex > -1) {
//       course.courseRatings[existingRatingIndex].rating = rating
//     } else {
//       course.courseRatings.push({ userId, rating })
//     }
//     await course.save()

//     return res.json({ success: true, message: "Rating added" })
//   } catch (error) {
//     return res.json({ success: false, message: error.message })
//   }
// }

import User from "../models/User.js";
import Course from "../models/Courses.js";
// import { CourseProgress } from "../models/CourseProgress.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";


export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");
    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.auth.userId;
    const {origin} = req.headers
    const userData=await User.findById(userId)
    
    
    const courseData = await Course.findById(courseId);
    if (!courseData) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }

    const purchaseData={
      courseId:courseData._id,
      userId,
      amount:(courseData.coursePrice - courseData.discount * courseData.coursePrice/100).toFixed(2),
    }

    // const amount = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2);
    const newPurchase = await Purchase.create(purchaseData)
    

    // stripe gateway


    const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // Creating line items to for Stripe
    const line_items = [{
      price_data: {
          currency,
          product_data: {
              name: courseData.courseTitle
          },
          unit_amount: Math.floor(newPurchase.amount) * 100
      },
      quantity: 1
    }]


    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/myenroll`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
          purchaseId: newPurchase._id.toString()
      }
  })
  
  res.json({ success: true, session_url: session.url })
  
  



    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: userId
      }
    };


    // Create a pending purchase record
    await Purchase.create({
      courseId: courseId,
      userId: userId,
      amount: amount,
      orderId: order.id,
      status: "pending"
    });

    res.json({
      success: true,
      data: {
        order_id: order.id,
        amount: amount,
        key: process.env.RAZORPAY_API_KEY
      }
    });

  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.auth.userId;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update purchase status
      const purchase = await Purchase.findOne({ orderId: razorpay_order_id });
      if (purchase) {
        purchase.status = "completed";
        purchase.paymentId = razorpay_payment_id;
        await purchase.save();
      }

      // Update user's enrolled courses
      const user = await User.findById(userId);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      // Update course's enrolled students
      const course = await Course.findById(courseId);
      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: "Lecture Already Completed" });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId]
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid Details" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found." });
    }

    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "User has not purchased this course" });
    }

    const existingRatingIndex = course.courseRatings.findIndex((r) => r.userId === userId);

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }
    await course.save();

    return res.json({ success: true, message: "Rating added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};