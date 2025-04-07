// // import express from 'express'
// // import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } 
// // from '../controllers/userController.js'

// // const userRouter = express.Router()

// // userRouter.get('/data', getUserData)
// // userRouter.get('/enrolled-courses', userEnrolledCourses)
// // userRouter.post('/purchase', purchaseCourse)
// // userRouter.post('/purchase')
// // userRouter.post('/update-progress',updateUserCourseProgress)
// // userRouter.post('/get-progress',getUserCourseProgress)
// // userRouter.post('/add-rating',addUserRating)




// // export default userRouter;
// import express from 'express'
// import { 
//     addUserRating, 
//     getUserCourseProgress, 
//     getUserData, 
//     handlePayPalSuccess,
//     purchaseCourse, 
//     updateUserCourseProgress, 
//     userEnrolledCourses 
// } from '../controllers/userController.js'

// const userRouter = express.Router()

// userRouter.get('/data', getUserData)
// userRouter.get('/enrolled-courses', userEnrolledCourses)
// userRouter.post('/purchase', purchaseCourse)
// userRouter.post('/purchase/paypal-success', handlePayPalSuccess)
// userRouter.post('/update-progress', updateUserCourseProgress)
// userRouter.post('/get-progress', getUserCourseProgress)
// userRouter.post('/add-rating', addUserRating)

// export default userRouter;






import express from 'express';
import { 
    addUserRating, 
    getUserCourseProgress, 
    getUserData, 
    purchaseCourse,
    verifyPayment, 
    updateUserCourseProgress, 
    userEnrolledCourses 
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/verify-payment', verifyPayment);
userRouter.post('/update-progress', updateUserCourseProgress);
userRouter.post('/get-progress', getUserCourseProgress);
userRouter.post('/add-rating', addUserRating);

export default userRouter;