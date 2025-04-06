// // // import { useContext, useEffect, useState } from "react"
// // // import { useParams, useNavigate } from "react-router-dom"
// // // import { AppContext } from "../../context/AppContext"
// // // import Loading from "../../components/student/Loading"
// // // import { assets } from "../../assets/assets"
// // // import Youtube from "react-youtube"
// // // import humanizeDuration from "humanize-duration"
// // // import { toast } from "react-toastify"
// // // import axios from "axios"
// // // import { PayPalButtons } from "@paypal/react-paypal-js"

// // // const CourseDetails = () => {
// // //   const { id } = useParams()
// // //   const [courseData, setCourseData] = useState(null)
// // //   const [isEnrolled, setIsEnrolled] = useState(false)
// // //   const [playerData, setPlayerData] = useState(null)
// // //   const [openSections, setOpenSections] = useState({})
// // //   const [loading, setLoading] = useState(true)
// // //   const [error, setError] = useState(null)
// // //   const [apiAttempts, setApiAttempts] = useState(0)

// // //   const navigate = useNavigate()

// // //   const {
// // //     allCourses,
// // //     calculateRating,
// // //     calculateNoOfLectures,
// // //     calculateChapterTime,
// // //     calculateCourseDuration,
// // //     currency,
// // //     calculateCourseRating,
// // //     backendUrl,
// // //     userData,
// // //     getToken,
// // //   } = useContext(AppContext)

// // //   // Debug function to inspect course data
// // //   const debugCourseData = (data) => {
// // //     console.log("Course data structure:", {
// // //       hasTitle: !!data.courseTitle,
// // //       hasDescription: !!data.courseDescription,
// // //       descriptionLength: data.courseDescription ? data.courseDescription.length : 0,
// // //       hasCourseContent: Array.isArray(data.courseContent),
// // //       courseContentLength: Array.isArray(data.courseContent) ? data.courseContent.length : 0,
// // //     })

// // //     if (Array.isArray(data.courseContent) && data.courseContent.length > 0) {
// // //       console.log("First chapter structure:", {
// // //         hasChapterTitle: !!data.courseContent[0].chapterTitle,
// // //         hasChapterContent: Array.isArray(data.courseContent[0].chapterContent),
// // //         chapterContentLength: Array.isArray(data.courseContent[0].chapterContent)
// // //           ? data.courseContent[0].chapterContent.length
// // //           : 0,
// // //       })
// // //     }
// // //   }

// // //   // Try to get course data from allCourses if API fails
// // //   const getCourseFromContext = () => {
// // //     if (allCourses && allCourses.length > 0) {
// // //       const foundCourse = allCourses.find((course) => course._id === id)
// // //       if (foundCourse) {
// // //         console.log("Found course in context:", foundCourse)
// // //         debugCourseData(foundCourse)
// // //         setCourseData(foundCourse)
// // //         setLoading(false)
// // //         return true
// // //       }
// // //     }
// // //     return false
// // //   }

// // //   const fetchCourseData = async () => {
// // //     try {
// // //       setLoading(true)
// // //       setApiAttempts((prev) => prev + 1)

// // //       // Log important information for debugging
// // //       console.log("Fetching course data attempt:", apiAttempts + 1)
// // //       console.log("Course ID:", id)
// // //       console.log("Backend URL:", backendUrl)

// // //       // Make sure backendUrl doesn't have trailing slash
// // //       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
// // //       const url = `${baseUrl}/api/course/${id}`

// // //       console.log("Full API URL:", url)

// // //       // Get auth token if available
// // //       const headers = {}
// // //       try {
// // //         const token = await getToken()
// // //         if (token) {
// // //           headers.Authorization = `Bearer ${token}`
// // //           console.log("Using auth token for request")
// // //         }
// // //       } catch (tokenError) {
// // //         console.log("No auth token available, proceeding without authentication")
// // //       }

// // //       // Make the API request with timeout
// // //       const { data } = await axios.get(url, {
// // //         headers,
// // //         timeout: 10000, // 10 second timeout
// // //       })

// // //       console.log("API Response:", data)

// // //       if (data && data.success) {
// // //         console.log("Course data fetched successfully")

// // //         // Ensure courseContent is an array
// // //         const processedData = {
// // //           ...data.courseData,
// // //           courseContent: Array.isArray(data.courseData.courseContent) ? data.courseData.courseContent : [],
// // //         }

// // //         // Debug the structure
// // //         debugCourseData(processedData)

// // //         setCourseData(processedData)
// // //         setLoading(false)
// // //       } else {
// // //         console.error("API returned success:false", data?.message)

// // //         // Try to get course from context as fallback
// // //         if (!getCourseFromContext()) {
// // //           setError(data?.message || "Failed to load course data")
// // //           toast.error(data?.message || "Failed to load course data")
// // //           setLoading(false)
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching course data:", error)
// // //       console.error("Error details:", error.response?.data || error.message)

// // //       // Try to get course from context as fallback
// // //       if (!getCourseFromContext()) {
// // //         // If we have allCourses data but couldn't find this course
// // //         if (allCourses && allCourses.length > 0) {
// // //           setError("Course not found in available courses")
// // //         } else {
// // //           setError(error.response?.data?.message || error.message || "Failed to connect to server")
// // //         }

// // //         toast.error("Failed to load course data. Please check your connection.")
// // //         setLoading(false)
// // //       }
// // //     }
// // //   }

// // //   // Direct API fetch with fetch API as a fallback
// // //   const fetchWithNativeFetch = async () => {
// // //     try {
// // //       console.log("Trying native fetch as fallback")
// // //       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
// // //       const url = `${baseUrl}/api/course/${id}`

// // //       const response = await fetch(url)
// // //       const data = await response.json()

// // //       console.log("Native fetch response:", data)

// // //       if (data && data.success) {
// // //         // Ensure courseContent is an array
// // //         const processedData = {
// // //           ...data.courseData,
// // //           courseContent: Array.isArray(data.courseData.courseContent) ? data.courseData.courseContent : [],
// // //         }

// // //         debugCourseData(processedData)
// // //         setCourseData(processedData)
// // //         setLoading(false)
// // //       } else {
// // //         // Final fallback - try to use a course from allCourses
// // //         if (!getCourseFromContext()) {
// // //           setError(data?.message || "Failed to load course data")
// // //           setLoading(false)
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error("Native fetch also failed:", error)
// // //       // Final attempt - try to use a course from allCourses
// // //       if (!getCourseFromContext()) {
// // //         setError("All attempts to fetch course data failed")
// // //         setLoading(false)
// // //       }
// // //     }
// // //   }

// // //   // Create a mock course structure if needed
// // //   const createMockCourseStructure = () => {
// // //     if (
// // //       courseData &&
// // //       (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0)
// // //     ) {
// // //       console.log("Creating mock course structure as fallback")

// // //       // Create a basic structure with placeholder content
// // //       const updatedCourseData = {
// // //         ...courseData,
// // //         courseContent: [
// // //           {
// // //             chapterTitle: "Introduction",
// // //             chapterContent: [
// // //               {
// // //                 lectureTitle: "Welcome to the course",
// // //                 lectureDuration: 5,
// // //                 isPreviewFree: true,
// // //               },
// // //             ],
// // //           },
// // //         ],
// // //       }

// // //       setCourseData(updatedCourseData)
// // //     }
// // //   }

// // //   const handlePayPalSuccess = async (details) => {
// // //     try {
// // //       const token = await getToken()
// // //       const response = await axios.post(
// // //         `${backendUrl}/api/user/purchase/paypal-success`,
// // //         {
// // //           courseId: courseData._id,
// // //           paymentId: details.id,
// // //           paymentStatus: details.status,
// // //         },
// // //         {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         },
// // //       )

// // //       if (response.data.success) {
// // //         toast.success("Course enrolled successfully!")
// // //         setIsEnrolled(true)
// // //       }
// // //     } catch (error) {
// // //       toast.error("Failed to verify payment")
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     if (id) {
// // //       // First try to get from context for immediate display
// // //       if (!getCourseFromContext()) {
// // //         // If not in context, fetch from API
// // //         fetchCourseData()
// // //       }
// // //     } else {
// // //       setError("Course ID is missing")
// // //       setLoading(false)
// // //     }
// // //   }, [id])

// // //   // If API fails multiple times, try native fetch as a last resort
// // //   useEffect(() => {
// // //     if (apiAttempts === 2 && loading && !courseData) {
// // //       fetchWithNativeFetch()
// // //     }
// // //   }, [apiAttempts])

// // //   // Create mock structure if needed
// // //   useEffect(() => {
// // //     if (
// // //       courseData &&
// // //       (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0)
// // //     ) {
// // //       createMockCourseStructure()
// // //     }
// // //   }, [courseData])

// // //   useEffect(() => {
// // //     if (userData && courseData) {
// // //       setIsEnrolled(userData.enrolledCourses?.includes(courseData._id))
// // //     }
// // //   }, [userData, courseData])

// // //   const toggleSection = (index) => {
// // //     setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
// // //   }

// // //   const retryFetch = () => {
// // //     setError(null)
// // //     setApiAttempts(0)
// // //     fetchCourseData()
// // //   }

// // //   if (loading) return <Loading />

// // //   if (error) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
// // //         <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Course</h2>
// // //         <p className="text-gray-700 mb-6">{error}</p>
// // //         <div className="flex gap-4">
// // //           <button
// // //             onClick={retryFetch}
// // //             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //           >
// // //             Try Again
// // //           </button>
// // //           <button
// // //             onClick={() => navigate("/")}
// // //             className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
// // //           >
// // //             Back to Home
// // //           </button>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   if (!courseData) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
// // //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Not Found</h2>
// // //         <p className="text-gray-700 mb-6">The course you're looking for doesn't exist or has been removed.</p>
// // //         <button
// // //           onClick={() => navigate("/")}
// // //           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //         >
// // //           Back to Home
// // //         </button>
// // //       </div>
// // //     )
// // //   }

// // //   // Ensure courseContent is an array
// // //   const courseContent = Array.isArray(courseData.courseContent) ? courseData.courseContent : []

// // //   const discountedPrice = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)

// // //   return (
// // //     <>
// // //       <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 md:pt-30 pt-20 text-left">
// // //         <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradien-to-b from-cyan-100/70"></div>
// // //         <div className="max-w-xl z-10 text-gray-500">
// // //           <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
// // //             {courseData.courseTitle || "Course Title"}
// // //           </h1>
// // //           <div
// // //             dangerouslySetInnerHTML={{
// // //               __html: courseData.courseDescription?.slice(0, 200) || "No description available",
// // //             }}
// // //             className="pt-4 md:text-base text-sm"
// // //           ></div>

// // //           <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
// // //             <p>{calculateRating ? calculateRating(courseData) : "0"}</p>
// // //             <div className="flex">
// // //               {[...Array(5)].map((_, i) => (
// // //                 <img
// // //                   key={i}
// // //                   src={
// // //                     i < Math.floor(calculateRating ? calculateRating(courseData) : 0) ? assets.star : assets.star_blank
// // //                   }
// // //                   alt=""
// // //                   className="w-3.5 h-3.5"
// // //                 />
// // //               ))}
// // //             </div>
// // //             <p className="text-blue-600">
// // //               ({courseData.courseRatings?.length || 0} {courseData.courseRatings?.length !== 1 ? "ratings" : "rating"})
// // //             </p>
// // //             <p>
// // //               {courseData.enrolledStudents?.length || 0}{" "}
// // //               {courseData.enrolledStudents?.length !== 1 ? "Students" : "Student"}
// // //             </p>
// // //           </div>

// // //           <p className="text-sm">
// // //             Course by <span className="text-blue-600 underline">{courseData.educator?.name || "Instructor"}</span>
// // //           </p>

// // //           <div className="pt-8 text-gray-800">
// // //             <h2 className="text-xl font-semibold">Course Structure</h2>
// // //             {courseContent.length > 0 ? (
// // //               <div className="pt-5">
// // //                 {courseContent.map((chapter, index) => (
// // //                   <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
// // //                     <div
// // //                       className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
// // //                       onClick={() => toggleSection(index)}
// // //                     >
// // //                       <div className="flex items-center gap-2">
// // //                         <img
// // //                           src={assets.down_arrow_icon || "/placeholder.svg"}
// // //                           alt=""
// // //                           className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
// // //                         />
// // //                         <p className="font-medium md:text-base text-sm">
// // //                           {chapter.chapterTitle || `Chapter ${index + 1}`}
// // //                         </p>
// // //                       </div>
// // //                       <p className="text-sm md:text-default">
// // //                         {chapter.chapterContent?.length || 0} lectures -{" "}
// // //                         {calculateChapterTime ? calculateChapterTime(chapter) : "0 min"}
// // //                       </p>
// // //                     </div>

// // //                     <div
// // //                       className={`overflow-hidden transition-all duration-300 
// // //                             ${openSections[index] ? "max-h-96" : "max-h-0"} `}
// // //                     >
// // //                       {Array.isArray(chapter.chapterContent) && chapter.chapterContent.length > 0 ? (
// // //                         <ul
// // //                           className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600
// // //                               border-t border-gray-300"
// // //                         >
// // //                           {chapter.chapterContent.map((lecture, i) => (
// // //                             <li key={i} className="flex items-start gap-2 py-1">
// // //                               <img src={assets.play_icon || "/placeholder.svg"} alt="" className="w-4 h-4 mt-1" />
// // //                               <div
// // //                                 className="flex items-center justify-between w-full
// // //                                     text-gray-800 text-xs md:text-default"
// // //                               >
// // //                                 <p>{lecture.lectureTitle || `Lecture ${i + 1}`}</p>
// // //                                 <div className="flex gap-2">
// // //                                   {lecture.isPreviewFree && (
// // //                                     <p
// // //                                       onClick={() =>
// // //                                         setPlayerData({
// // //                                           videoId: lecture.lectureUrl ? lecture.lectureUrl.split("/").pop() : "",
// // //                                         })
// // //                                       }
// // //                                       className="text-blue-500 cursor-pointer"
// // //                                     >
// // //                                       Preview
// // //                                     </p>
// // //                                   )}
// // //                                   <p>
// // //                                     {humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, {
// // //                                       units: ["h", "m"],
// // //                                     })}
// // //                                   </p>
// // //                                 </div>
// // //                               </div>
// // //                             </li>
// // //                           ))}
// // //                         </ul>
// // //                       ) : (
// // //                         <div className="px-4 py-2 text-gray-500 border-t border-gray-300">
// // //                           No lectures available in this chapter.
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ) : (
// // //               <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
// // //                 <p className="text-gray-600">
// // //                   No course structure available yet. This course is still being developed.
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </div>

// // //           <div className="py-20 text-sm md:text-default">
// // //             <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
// // //             {courseData.courseDescription ? (
// // //               <div dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} className="pt-3 rich-text"></div>
// // //             ) : (
// // //               <p className="pt-3 text-gray-600">
// // //                 Detailed course description will be available soon. Stay tuned for updates!
// // //               </p>
// // //             )}
// // //           </div>
// // //         </div>

// // //         <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
// // //           {playerData ? (
// // //             <Youtube
// // //               videoId={playerData.videoId}
// // //               opts={{
// // //                 playerVars: { autoplay: 1 },
// // //               }}
// // //               iframeClassName="w-full aspect-video"
// // //             />
// // //           ) : (
// // //             <img
// // //               src={courseData.courseThumbnail || "/placeholder.svg"}
// // //               alt=""
// // //               className="w-full aspect-video object-cover"
// // //             />
// // //           )}

// // //           <div className="p-5">
// // //             <div className="flex items-center gap-2">
// // //               <img
// // //                 className="w-3.5"
// // //                 src={assets.time_left_clock_icon || "/placeholder.svg"}
// // //                 alt="time left clock icon"
// // //               />
// // //               <p className="text-red-500">
// // //                 <span className="font-medium">5 days</span> left at this price!
// // //               </p>
// // //             </div>

// // //             <div className="flex gap-3 items-center pt-2">
// // //               <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
// // //                 {currency}
// // //                 {discountedPrice}
// // //               </p>
// // //               <p className="md:text-lg text-gray-500 line-through">
// // //                 {currency}
// // //                 {courseData.coursePrice}
// // //               </p>
// // //               <p className="md:text-lg text-gray-500">{courseData.discount}% off</p>
// // //             </div>

// // //             {!isEnrolled && (
// // //               <div className="mt-4">
// // //                 <PayPalButtons
// // //                   createOrder={(data, actions) => {
// // //                     return actions.order.create({
// // //                       purchase_units: [
// // //                         {
// // //                           amount: {
// // //                             value: discountedPrice,
// // //                             currency_code: "USD",
// // //                           },
// // //                           description: courseData.courseTitle,
// // //                         },
// // //                       ],
// // //                     })
// // //                   }}
// // //                   onApprove={(data, actions) => {
// // //                     return actions.order.capture().then(handlePayPalSuccess)
// // //                   }}
// // //                   onError={(err) => {
// // //                     toast.error("PayPal payment failed")
// // //                     console.error(err)
// // //                   }}
// // //                   style={{
// // //                     layout: "vertical",
// // //                     color: "blue",
// // //                     shape: "rect",
// // //                     label: "pay",
// // //                   }}
// // //                 />
// // //               </div>
// // //             )}

// // //             {isEnrolled && (
// // //               <button
// // //                 className="md:mt-6 mt-4 w-full py-3 rounded bg-green-600 text-white font-medium"
// // //                 onClick={() => navigate(`/player/${courseData._id}`)}
// // //               >
// // //                 Go to Course
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </>
// // //   )
// // // }

// // // export default CourseDetails



// // "use client"

// // import { useContext, useEffect, useState } from "react"
// // import { useParams, useNavigate } from "react-router-dom"
// // import { AppContext } from "../../context/AppContext"
// // import Loading from "../../components/student/Loading"
// // import { assets } from "../../assets/assets"
// // import Youtube from "react-youtube"
// // import humanizeDuration from "humanize-duration"
// // import { toast } from "react-toastify"
// // import axios from "axios"

// // const CourseDetails = () => {
// //   const { id } = useParams()
// //   const [courseData, setCourseData] = useState(null)
// //   const [isEnrolled, setIsEnrolled] = useState(false)
// //   const [playerData, setPlayerData] = useState(null)
// //   const [openSections, setOpenSections] = useState({})
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)
// //   const [apiAttempts, setApiAttempts] = useState(0)
// //   const [paymentLoading, setPaymentLoading] = useState(false)

// //   const navigate = useNavigate()

// //   const {
// //     allCourses,
// //     calculateRating,
// //     calculateNoOfLectures,
// //     calculateChapterTime,
// //     calculateCourseDuration,
// //     currency,
// //     calculateCourseRating,
// //     backendUrl,
// //     userData,
// //     getToken,
// //   } = useContext(AppContext)

// //   // Debug function to inspect course data
// //   const debugCourseData = (data) => {
// //     console.log("Course data structure:", {
// //       hasTitle: !!data.courseTitle,
// //       hasDescription: !!data.courseDescription,
// //       descriptionLength: data.courseDescription ? data.courseDescription.length : 0,
// //       hasCourseContent: Array.isArray(data.courseContent),
// //       courseContentLength: Array.isArray(data.courseContent) ? data.courseContent.length : 0,
// //     })

// //     if (Array.isArray(data.courseContent) && data.courseContent.length > 0) {
// //       console.log("First chapter structure:", {
// //         hasChapterTitle: !!data.courseContent[0].chapterTitle,
// //         hasChapterContent: Array.isArray(data.courseContent[0].chapterContent),
// //         chapterContentLength: Array.isArray(data.courseContent[0].chapterContent)
// //           ? data.courseContent[0].chapterContent.length
// //           : 0,
// //       })
// //     }
// //   }

// //   // Try to get course data from allCourses if API fails
// //   const getCourseFromContext = () => {
// //     if (allCourses && allCourses.length > 0) {
// //       const foundCourse = allCourses.find((course) => course._id === id)
// //       if (foundCourse) {
// //         console.log("Found course in context:", foundCourse)
// //         debugCourseData(foundCourse)
// //         setCourseData(foundCourse)
// //         setLoading(false)
// //         return true
// //       }
// //     }
// //     return false
// //   }

// //   const fetchCourseData = async () => {
// //     try {
// //       setLoading(true)
// //       setApiAttempts((prev) => prev + 1)

// //       // Log important information for debugging
// //       console.log("Fetching course data attempt:", apiAttempts + 1)
// //       console.log("Course ID:", id)
// //       console.log("Backend URL:", backendUrl)

// //       // Make sure backendUrl doesn't have trailing slash
// //       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
// //       const url = `${baseUrl}/api/course/${id}`

// //       console.log("Full API URL:", url)

// //       // Get auth token if available
// //       const headers = {}
// //       try {
// //         const token = await getToken()
// //         if (token) {
// //           headers.Authorization = `Bearer ${token}`
// //           console.log("Using auth token for request")
// //         }
// //       } catch (tokenError) {
// //         console.log("No auth token available, proceeding without authentication")
// //       }

// //       // Make the API request with timeout
// //       const { data } = await axios.get(url, {
// //         headers,
// //         timeout: 10000, // 10 second timeout
// //       })

// //       console.log("API Response:", data)

// //       if (data && data.success) {
// //         console.log("Course data fetched successfully")

// //         // Ensure courseContent is an array
// //         const processedData = {
// //           ...data.courseData,
// //           courseContent: Array.isArray(data.courseData.courseContent) ? data.courseData.courseContent : [],
// //         }

// //         // Debug the structure
// //         debugCourseData(processedData)

// //         setCourseData(processedData)
// //         setLoading(false)
// //       } else {
// //         console.error("API returned success:false", data?.message)

// //         // Try to get course from context as fallback
// //         if (!getCourseFromContext()) {
// //           setError(data?.message || "Failed to load course data")
// //           toast.error(data?.message || "Failed to load course data")
// //           setLoading(false)
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error fetching course data:", error)
// //       console.error("Error details:", error.response?.data || error.message)

// //       // Try to get course from context as fallback
// //       if (!getCourseFromContext()) {
// //         // If we have allCourses data but couldn't find this course
// //         if (allCourses && allCourses.length > 0) {
// //           setError("Course not found in available courses")
// //         } else {
// //           setError(error.response?.data?.message || error.message || "Failed to connect to server")
// //         }

// //         toast.error("Failed to load course data. Please check your connection.")
// //         setLoading(false)
// //       }
// //     }
// //   }

// //   // Direct API fetch with fetch API as a fallback
// //   const fetchWithNativeFetch = async () => {
// //     try {
// //       console.log("Trying native fetch as fallback")
// //       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
// //       const url = `${baseUrl}/api/course/${id}`

// //       const response = await fetch(url)
// //       const data = await response.json()

// //       console.log("Native fetch response:", data)

// //       if (data && data.success) {
// //         // Ensure courseContent is an array
// //         const processedData = {
// //           ...data.courseData,
// //           courseContent: Array.isArray(data.courseData.courseContent) ? data.courseData.courseContent : [],
// //         }

// //         debugCourseData(processedData)
// //         setCourseData(processedData)
// //         setLoading(false)
// //       } else {
// //         // Final fallback - try to use a course from allCourses
// //         if (!getCourseFromContext()) {
// //           setError(data?.message || "Failed to load course data")
// //           setLoading(false)
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Native fetch also failed:", error)
// //       // Final attempt - try to use a course from allCourses
// //       if (!getCourseFromContext()) {
// //         setError("All attempts to fetch course data failed")
// //         setLoading(false)
// //       }
// //     }
// //   }

// //   // Create a mock course structure if needed
// //   const createMockCourseStructure = () => {
// //     if (
// //       courseData &&
// //       (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0)
// //     ) {
// //       console.log("Creating mock course structure as fallback")

// //       // Create a basic structure with placeholder content
// //       const updatedCourseData = {
// //         ...courseData,
// //         courseContent: [
// //           {
// //             chapterTitle: "Introduction",
// //             chapterContent: [
// //               {
// //                 lectureTitle: "Welcome to the course",
// //                 lectureDuration: 5,
// //                 isPreviewFree: true,
// //               },
// //             ],
// //           },
// //         ],
// //       }

// //       setCourseData(updatedCourseData)
// //     }
// //   }

// //   // PhonePe payment integration
// //   const initiatePhonePePayment = async () => {
// //     if (!userData) {
// //       toast.error("Please login to purchase this course")
// //       return
// //     }

// //     try {
// //       setPaymentLoading(true)
// //       const token = await getToken()

// //       if (!token) {
// //         toast.error("Authentication required")
// //         setPaymentLoading(false)
// //         return
// //       }

// //       // Make sure backendUrl doesn't have trailing slash
// //       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl

// //       // Step 1: Create a payment request on your backend
// //       const response = await axios.post(
// //         `${baseUrl}/api/user/purchase/phonepe-initiate`,
// //         {
// //           courseId: courseData._id,
// //           amount: Number.parseFloat(discountedPrice),
// //           userId: userData._id,
// //           courseTitle: courseData.courseTitle,
// //         },
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         },
// //       )

// //       if (response.data.success && response.data.paymentUrl) {
// //         // Step 2: Open the PhonePe payment URL
// //         // For production, you'd redirect to the payment URL
// //         console.log("Redirecting to payment URL:", response.data.paymentUrl)

// //         // Store transaction ID in localStorage for verification after redirect
// //         if (response.data.transactionId) {
// //           localStorage.setItem("phonePeTransactionId", response.data.transactionId)
// //         }

// //         // Redirect to PhonePe payment page
// //         window.location.href = response.data.paymentUrl
// //       } else {
// //         toast.error(response.data.message || "Failed to initiate payment")
// //         setPaymentLoading(false)
// //       }
// //     } catch (error) {
// //       console.error("PhonePe payment initiation error:", error)
// //       toast.error(error.response?.data?.message || "Payment initiation failed")
// //       setPaymentLoading(false)
// //     }
// //   }

// //   // For test payments - simulate a successful payment
// //   const simulateTestPayment = async () => {
// //     try {
// //       setPaymentLoading(true)
// //       const token = await getToken()

// //       if (!token) {
// //         toast.error("Authentication required")
// //         setPaymentLoading(false)
// //         return
// //       }

// //       // Make sure backendUrl doesn't have trailing slash
// //       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl

// //       // Simulate a successful payment for testing
// //       const response = await axios.post(
// //         `${baseUrl}/api/user/purchase/test-payment-success`,
// //         {
// //           courseId: courseData._id,
// //           amount: Number.parseFloat(discountedPrice),
// //         },
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         },
// //       )

// //       if (response.data.success) {
// //         toast.success("Test payment successful! Course enrolled.")
// //         setIsEnrolled(true)
// //       } else {
// //         toast.error(response.data.message || "Test payment failed")
// //       }
// //       setPaymentLoading(false)
// //     } catch (error) {
// //       console.error("Test payment error:", error)
// //       toast.error(error.response?.data?.message || "Test payment failed")
// //       setPaymentLoading(false)
// //     }
// //   }

// //   // Check for payment status on component mount (for handling redirect back from PhonePe)
// //   const checkPaymentStatus = async () => {
// //     const transactionId = localStorage.getItem("phonePeTransactionId")

// //     if (transactionId) {
// //       try {
// //         const token = await getToken()
// //         const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl

// //         const response = await axios.get(`${baseUrl}/api/user/purchase/phonepe-status?transactionId=${transactionId}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         })

// //         if (response.data.success && response.data.paymentStatus === "SUCCESS") {
// //           toast.success("Payment successful! Course enrolled.")
// //           setIsEnrolled(true)
// //         } else if (response.data.paymentStatus === "PENDING") {
// //           toast.info("Payment is being processed. We'll update you soon.")
// //         } else if (response.data.paymentStatus === "FAILED") {
// //           toast.error("Payment failed. Please try again.")
// //         }

// //         // Clear the transaction ID from localStorage
// //         localStorage.removeItem("phonePeTransactionId")
// //       } catch (error) {
// //         console.error("Error checking payment status:", error)
// //       }
// //     }
// //   }

// //   useEffect(() => {
// //     if (id) {
// //       // First try to get from context for immediate display
// //       if (!getCourseFromContext()) {
// //         // If not in context, fetch from API
// //         fetchCourseData()
// //       }
// //     } else {
// //       setError("Course ID is missing")
// //       setLoading(false)
// //     }

// //     // Check payment status on component mount (for redirect back from PhonePe)
// //     checkPaymentStatus()
// //   }, [id])

// //   // If API fails multiple times, try native fetch as a last resort
// //   useEffect(() => {
// //     if (apiAttempts === 2 && loading && !courseData) {
// //       fetchWithNativeFetch()
// //     }
// //   }, [apiAttempts])

// //   // Create mock structure if needed
// //   useEffect(() => {
// //     if (
// //       courseData &&
// //       (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0)
// //     ) {
// //       createMockCourseStructure()
// //     }
// //   }, [courseData])

// //   useEffect(() => {
// //     if (userData && courseData) {
// //       setIsEnrolled(userData.enrolledCourses?.includes(courseData._id))
// //     }
// //   }, [userData, courseData])

// //   const toggleSection = (index) => {
// //     setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
// //   }

// //   const retryFetch = () => {
// //     setError(null)
// //     setApiAttempts(0)
// //     fetchCourseData()
// //   }

// //   if (loading) return <Loading />

// //   if (error) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
// //         <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Course</h2>
// //         <p className="text-gray-700 mb-6">{error}</p>
// //         <div className="flex gap-4">
// //           <button
// //             onClick={retryFetch}
// //             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //           >
// //             Try Again
// //           </button>
// //           <button
// //             onClick={() => navigate("/")}
// //             className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
// //           >
// //             Back to Home
// //           </button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (!courseData) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Not Found</h2>
// //         <p className="text-gray-700 mb-6">The course you're looking for doesn't exist or has been removed.</p>
// //         <button
// //           onClick={() => navigate("/")}
// //           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //         >
// //           Back to Home
// //         </button>
// //       </div>
// //     )
// //   }

// //   // Ensure courseContent is an array
// //   const courseContent = Array.isArray(courseData.courseContent) ? courseData.courseContent : []

// //   const discountedPrice = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)

// //   return (
// //     <>
// //       <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 md:pt-30 pt-20 text-left">
// //         <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradien-to-b from-cyan-100/70"></div>
// //         <div className="max-w-xl z-10 text-gray-500">
// //           <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
// //             {courseData.courseTitle || "Course Title"}
// //           </h1>
// //           <div
// //             dangerouslySetInnerHTML={{
// //               __html: courseData.courseDescription?.slice(0, 200) || "No description available",
// //             }}
// //             className="pt-4 md:text-base text-sm"
// //           ></div>

// //           <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
// //             <p>{calculateRating ? calculateRating(courseData) : "0"}</p>
// //             <div className="flex">
// //               {[...Array(5)].map((_, i) => (
// //                 <img
// //                   key={i}
// //                   src={
// //                     i < Math.floor(calculateRating ? calculateRating(courseData) : 0) ? assets.star : assets.star_blank
// //                   }
// //                   alt=""
// //                   className="w-3.5 h-3.5"
// //                 />
// //               ))}
// //             </div>
// //             <p className="text-blue-600">
// //               ({courseData.courseRatings?.length || 0} {courseData.courseRatings?.length !== 1 ? "ratings" : "rating"})
// //             </p>
// //             <p>
// //               {courseData.enrolledStudents?.length || 0}{" "}
// //               {courseData.enrolledStudents?.length !== 1 ? "Students" : "Student"}
// //             </p>
// //           </div>

// //           <p className="text-sm">
// //             Course by <span className="text-blue-600 underline">{courseData.educator?.name || "Instructor"}</span>
// //           </p>

// //           <div className="pt-8 text-gray-800">
// //             <h2 className="text-xl font-semibold">Course Structure</h2>
// //             {courseContent.length > 0 ? (
// //               <div className="pt-5">
// //                 {courseContent.map((chapter, index) => (
// //                   <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
// //                     <div
// //                       className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
// //                       onClick={() => toggleSection(index)}
// //                     >
// //                       <div className="flex items-center gap-2">
// //                         <img
// //                           src={assets.down_arrow_icon || "/placeholder.svg"}
// //                           alt=""
// //                           className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
// //                         />
// //                         <p className="font-medium md:text-base text-sm">
// //                           {chapter.chapterTitle || `Chapter ${index + 1}`}
// //                         </p>
// //                       </div>
// //                       <p className="text-sm md:text-default">
// //                         {chapter.chapterContent?.length || 0} lectures -{" "}
// //                         {calculateChapterTime ? calculateChapterTime(chapter) : "0 min"}
// //                       </p>
// //                     </div>

// //                     <div
// //                       className={`overflow-hidden transition-all duration-300 
// //                             ${openSections[index] ? "max-h-96" : "max-h-0"} `}
// //                     >
// //                       {Array.isArray(chapter.chapterContent) && chapter.chapterContent.length > 0 ? (
// //                         <ul
// //                           className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600
// //                               border-t border-gray-300"
// //                         >
// //                           {chapter.chapterContent.map((lecture, i) => (
// //                             <li key={i} className="flex items-start gap-2 py-1">
// //                               <img src={assets.play_icon || "/placeholder.svg"} alt="" className="w-4 h-4 mt-1" />
// //                               <div
// //                                 className="flex items-center justify-between w-full
// //                                     text-gray-800 text-xs md:text-default"
// //                               >
// //                                 <p>{lecture.lectureTitle || `Lecture ${i + 1}`}</p>
// //                                 <div className="flex gap-2">
// //                                   {lecture.isPreviewFree && (
// //                                     <p
// //                                       onClick={() =>
// //                                         setPlayerData({
// //                                           videoId: lecture.lectureUrl ? lecture.lectureUrl.split("/").pop() : "",
// //                                         })
// //                                       }
// //                                       className="text-blue-500 cursor-pointer"
// //                                     >
// //                                       Preview
// //                                     </p>
// //                                   )}
// //                                   <p>
// //                                     {humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, {
// //                                       units: ["h", "m"],
// //                                     })}
// //                                   </p>
// //                                 </div>
// //                               </div>
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       ) : (
// //                         <div className="px-4 py-2 text-gray-500 border-t border-gray-300">
// //                           No lectures available in this chapter.
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
// //                 <p className="text-gray-600">
// //                   No course structure available yet. This course is still being developed.
// //                 </p>
// //               </div>
// //             )}
// //           </div>

// //           <div className="py-20 text-sm md:text-default">
// //             <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
// //             {courseData.courseDescription ? (
// //               <div dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} className="pt-3 rich-text"></div>
// //             ) : (
// //               <p className="pt-3 text-gray-600">
// //                 Detailed course description will be available soon. Stay tuned for updates!
// //               </p>
// //             )}
// //           </div>
// //         </div>

// //         <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
// //           {playerData ? (
// //             <Youtube
// //               videoId={playerData.videoId}
// //               opts={{
// //                 playerVars: { autoplay: 1 },
// //               }}
// //               iframeClassName="w-full aspect-video"
// //             />
// //           ) : (
// //             <img
// //               src={courseData.courseThumbnail || "/placeholder.svg"}
// //               alt=""
// //               className="w-full aspect-video object-cover"
// //             />
// //           )}

// //           <div className="p-5">
// //             <div className="flex items-center gap-2">
// //               <img
// //                 className="w-3.5"
// //                 src={assets.time_left_clock_icon || "/placeholder.svg"}
// //                 alt="time left clock icon"
// //               />
// //               <p className="text-red-500">
// //                 <span className="font-medium">5 days</span> left at this price!
// //               </p>
// //             </div>

// //             <div className="flex gap-3 items-center pt-2">
// //               <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
// //                 {currency}
// //                 {discountedPrice}
// //               </p>
// //               <p className="md:text-lg text-gray-500 line-through">
// //                 {currency}
// //                 {courseData.coursePrice}
// //               </p>
// //               <p className="md:text-lg text-gray-500">{courseData.discount}% off</p>
// //             </div>

// //             {!isEnrolled && (
// //               <div className="mt-4 flex flex-col gap-3">
// //                 <button
// //                   className="w-full py-3 rounded bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center justify-center gap-2 transition-colors"
// //                   onClick={initiatePhonePePayment}
// //                   disabled={paymentLoading}
// //                 >
// //                   {paymentLoading ? (
// //                     <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
// //                   ) : (
// //                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
// //                       <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
// //                       <path
// //                         fillRule="evenodd"
// //                         d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z"
// //                         clipRule="evenodd"
// //                       />
// //                     </svg>
// //                   )}
// //                   Pay with RazorPay
// //                 </button>

// //                 <button
// //                   className="w-full py-3 rounded bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center gap-2 transition-colors"
// //                   onClick={simulateTestPayment}
// //                   disabled={paymentLoading}
// //                 >
// //                   {paymentLoading ? (
// //                     <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
// //                   ) : (
// //                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
// //                       <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
// //                       <path
// //                         fillRule="evenodd"
// //                         d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
// //                         clipRule="evenodd"
// //                       />
// //                     </svg>
// //                   )}
// //                   Test Payment (Simulate)
// //                 </button>
// //               </div>
// //             )}

// //             {isEnrolled && (
// //               <button
// //                 className="md:mt-6 mt-4 w-full py-3 rounded bg-green-600 text-white font-medium"
// //                 onClick={() => navigate(`/player/${courseData._id}`)}
// //               >
// //                 Go to Course
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   )
// // }

// // export default CourseDetails

// "use client"

// import { useContext, useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { AppContext } from "../../context/AppContext"
// import Loading from "../../components/student/Loading"
// import { assets } from "../../assets/assets"
// import Youtube from "react-youtube"
// import humanizeDuration from "humanize-duration"
// import { toast } from "react-toastify"
// import axios from "axios"

// const CourseDetails = () => {
//   const { id } = useParams()
//   const [courseData, setCourseData] = useState(null)
//   const [isEnrolled, setIsEnrolled] = useState(false)
//   const [playerData, setPlayerData] = useState(null)
//   const [openSections, setOpenSections] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [apiAttempts, setApiAttempts] = useState(0)
//   const [paymentLoading, setPaymentLoading] = useState(false)

//   const navigate = useNavigate()

//   const {
//     allCourses,
//     calculateRating,
//     calculateNoOfLectures,
//     calculateChapterTime,
//     calculateCourseDuration,
//     currency,
//     calculateCourseRating,
//     backendUrl,
//     userData,
//     getToken,
//   } = useContext(AppContext)

//   // Debug function to inspect course data
//   const debugCourseData = (data) => {
//     console.log("Course data structure:", {
//       hasTitle: !!data.courseTitle,
//       hasDescription: !!data.courseDescription,
//       descriptionLength: data.courseDescription ? data.courseDescription.length : 0,
//       hasCourseContent: Array.isArray(data.courseContent),
//       courseContentLength: Array.isArray(data.courseContent) ? data.courseContent.length : 0,
//     })

//     if (Array.isArray(data.courseContent) && data.courseContent.length > 0) {
//       console.log("First chapter structure:", {
//         hasChapterTitle: !!data.courseContent[0].chapterTitle,
//         hasChapterContent: Array.isArray(data.courseContent[0].chapterContent),
//         chapterContentLength: Array.isArray(data.courseContent[0].chapterContent)
//           ? data.courseContent[0].chapterContent.length
//           : 0,
//       })
//     }
//   }

//   // Try to get course data from allCourses if API fails
//   const getCourseFromContext = () => {
//     if (allCourses && allCourses.length > 0) {
//       const foundCourse = allCourses.find((course) => course._id === id)
//       if (foundCourse) {
//         console.log("Found course in context:", foundCourse)
//         debugCourseData(foundCourse)
//         setCourseData(foundCourse)
//         setLoading(false)
//         return true
//       }
//     }
//     return false
//   }

//   const fetchCourseData = async () => {
//     try {
//       setLoading(true)
//       setApiAttempts((prev) => prev + 1)

//       // Log important information for debugging
//       console.log("Fetching course data attempt:", apiAttempts + 1)
//       console.log("Course ID:", id)
//       console.log("Backend URL:", backendUrl)

//       // Make sure backendUrl doesn't have trailing slash
//       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
//       const url = `${baseUrl}/api/course/${id}`

//       console.log("Full API URL:", url)

//       // Get auth token if available
//       const headers = {}
//       try {
//         const token = await getToken()
//         if (token) {
//           headers.Authorization = `Bearer ${token}`
//           console.log("Using auth token for request")
//         }
//       } catch (tokenError) {
//         console.log("No auth token available, proceeding without authentication")
//       }

//       // Make the API request with timeout
//       const { data } = await axios.get(url, {
//         headers,
//         timeout: 10000, // 10 second timeout
//       })

//       console.log("API Response:", data)

//       if (data && data.success) {
//         console.log("Course data fetched successfully")

//         // Ensure courseContent is an array
//         const processedData = {
//           ...data.courseData,
//           courseContent: Array.isArray(data.courseData.courseContent) ? data.courseData.courseContent : [],
//         }

//         // Debug the structure
//         debugCourseData(processedData)

//         setCourseData(processedData)
//         setLoading(false)
//       } else {
//         console.error("API returned success:false", data?.message)

//         // Try to get course from context as fallback
//         if (!getCourseFromContext()) {
//           setError(data?.message || "Failed to load course data")
//           toast.error(data?.message || "Failed to load course data")
//           setLoading(false)
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching course data:", error)
//       console.error("Error details:", error.response?.data || error.message)

//       // Try to get course from context as fallback
//       if (!getCourseFromContext()) {
//         // If we have allCourses data but couldn't find this course
//         if (allCourses && allCourses.length > 0) {
//           setError("Course not found in available courses")
//         } else {
//           setError(error.response?.data?.message || error.message || "Failed to connect to server")
//         }

//         toast.error("Failed to load course data. Please check your connection.")
//         setLoading(false)
//       }
//     }
//   }

//   // Direct API fetch with fetch API as a fallback
//   const fetchWithNativeFetch = async () => {
//     try {
//       console.log("Trying native fetch as fallback")
//       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
//       const url = `${baseUrl}/api/course/${id}`

//       const response = await fetch(url)
//       const data = await response.json()

//       console.log("Native fetch response:", data)

//       if (data && data.success) {
//         // Ensure courseContent is an array
//         const processedData = {
//           ...data.courseData,
//           courseContent: Array.isArray(data.courseData.courseContent) ? data.courseData.courseContent : [],
//         }

//         debugCourseData(processedData)
//         setCourseData(processedData)
//         setLoading(false)
//       } else {
//         // Final fallback - try to use a course from allCourses
//         if (!getCourseFromContext()) {
//           setError(data?.message || "Failed to load course data")
//           setLoading(false)
//         }
//       }
//     } catch (error) {
//       console.error("Native fetch also failed:", error)
//       // Final attempt - try to use a course from allCourses
//       if (!getCourseFromContext()) {
//         setError("All attempts to fetch course data failed")
//         setLoading(false)
//       }
//     }
//   }

//   // Create a mock course structure if needed
//   const createMockCourseStructure = () => {
//     if (
//       courseData &&
//       (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0)
//     ) {
//       console.log("Creating mock course structure as fallback")

//       // Create a basic structure with placeholder content
//       const updatedCourseData = {
//         ...courseData,
//         courseContent: [
//           {
//             chapterTitle: "Introduction",
//             chapterContent: [
//               {
//                 lectureTitle: "Welcome to the course",
//                 lectureDuration: 5,
//                 isPreviewFree: true,
//               },
//             ],
//           },
//         ],
//       }

//       setCourseData(updatedCourseData)
//     }
//   }

//   // Update the initiateRazorPayPayment function to include loading the Razorpay script
//   const initiateRazorPayPayment = async () => {
//     if (!userData) {
//       toast.error("Please login to purchase this course")
//       return
//     }

//     try {
//       setPaymentLoading(true)
//       const token = await getToken()

//       if (!token) {
//         toast.error("Authentication required")
//         setPaymentLoading(false)
//         return
//       }

//       // Make sure backendUrl doesn't have trailing slash
//       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl

//       // Step 1: Create a payment order on your backend
//       const response = await axios.post(
//         `${baseUrl}/api/user/purchase/razorpay-initiate`,
//         {
//           courseId: courseData._id,
//           amount: Number.parseFloat(discountedPrice),
//           userId: userData._id,
//           courseTitle: courseData.courseTitle,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       )

//       if (response.data.success && response.data.order) {
//         // Load Razorpay script if not already loaded
//         if (!window.Razorpay) {
//           await loadRazorpayScript()
//         }

//         // Step 2: Initialize Razorpay payment
//         const options = {
//           key: response.data.razorpayKeyId, // Your Razorpay Key ID from backend
//           amount: response.data.order.amount,
//           currency: response.data.order.currency,
//           name: "Course Purchase",
//           description: courseData.courseTitle,
//           order_id: response.data.order.id,
//           handler: async (response) => {
//             try {
//               // Verify payment on backend
//               const verifyResponse = await axios.post(
//                 `${baseUrl}/api/user/purchase/razorpay-verify`,
//                 {
//                   courseId: courseData._id,
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_signature: response.razorpay_signature,
//                 },
//                 {
//                   headers: { Authorization: `Bearer ${token}` },
//                 },
//               )

//               if (verifyResponse.data.success) {
//                 toast.success("Payment successful! Course enrolled.")
//                 setIsEnrolled(true)
//               } else {
//                 toast.error("Payment verification failed. Please contact support.")
//               }
//             } catch (error) {
//               console.error("Payment verification error:", error)
//               toast.error("Payment verification failed. Please contact support.")
//             }
//             setPaymentLoading(false)
//           },
//           prefill: {
//             name: userData.name || "",
//             email: userData.email || "",
//           },
//           theme: {
//             color: "#6366F1",
//           },
//           modal: {
//             ondismiss: () => {
//               setPaymentLoading(false)
//             },
//           },
//         }

//         // Store order ID in localStorage for verification after redirect/page refresh
//         localStorage.setItem("razorpayOrderId", response.data.order.id)

//         const razorpay = new window.Razorpay(options)
//         razorpay.open()
//       } else {
//         toast.error(response.data.message || "Failed to initiate payment")
//         setPaymentLoading(false)
//       }
//     } catch (error) {
//       console.error("Razorpay payment initiation error:", error)
//       toast.error(error.response?.data?.message || "Payment initiation failed")
//       setPaymentLoading(false)
//     }
//   }

//   // Add a function to load the Razorpay script
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.onload = () => {
//         resolve(true)
//       }
//       script.onerror = () => {
//         resolve(false)
//         toast.error("Failed to load Razorpay. Please try again.")
//       }
//       document.body.appendChild(script)
//     })
//   }

//   // For test payments - simulate a successful payment
//   const simulateTestPayment = async () => {
//     try {
//       setPaymentLoading(true)
//       const token = await getToken()

//       if (!token) {
//         toast.error("Authentication required")
//         setPaymentLoading(false)
//         return
//       }

//       // Make sure backendUrl doesn't have trailing slash
//       const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl

//       // Simulate a successful payment for testing
//       const response = await axios.post(
//         `${baseUrl}/api/user/purchase/test-payment-success`,
//         {
//           courseId: courseData._id,
//           amount: Number.parseFloat(discountedPrice),
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       )

//       if (response.data.success) {
//         toast.success("Test payment successful! Course enrolled.")
//         setIsEnrolled(true)
//       } else {
//         toast.error(response.data.message || "Test payment failed")
//       }
//       setPaymentLoading(false)
//     } catch (error) {
//       console.error("Test payment error:", error)
//       toast.error(error.response?.data?.message || "Test payment failed")
//       setPaymentLoading(false)
//     }
//   }

//   const checkPaymentStatus = async () => {
//     const razorpayOrderId = localStorage.getItem("razorpayOrderId")

//     if (razorpayOrderId) {
//       try {
//         const token = await getToken()
//         const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl

//         const response = await axios.get(`${baseUrl}/api/user/purchase/razorpay-status?orderId=${razorpayOrderId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         if (response.data.success && response.data.paymentStatus === "paid") {
//           toast.success("Payment successful! Course enrolled.")
//           setIsEnrolled(true)
//         } else if (response.data.paymentStatus === "created") {
//           toast.info("Payment is being processed. We'll update you soon.")
//         } else if (response.data.paymentStatus === "failed") {
//           toast.error("Payment failed. Please try again.")
//         }

//         // Clear the order ID from localStorage
//         localStorage.removeItem("razorpayOrderId")
//       } catch (error) {
//         console.error("Error checking payment status:", error)
//       }
//     }
//   }

//   useEffect(() => {
//     if (id) {
//       // First try to get from context for immediate display
//       if (!getCourseFromContext()) {
//         // If not in context, fetch from API
//         fetchCourseData()
//       }
//     } else {
//       setError("Course ID is missing")
//       setLoading(false)
//     }

//     // Check payment status on component mount (for redirect back from PhonePe)
//     checkPaymentStatus()
//   }, [id])

//   // If API fails multiple times, try native fetch as a last resort
//   useEffect(() => {
//     if (apiAttempts === 2 && loading && !courseData) {
//       fetchWithNativeFetch()
//     }
//   }, [apiAttempts])

//   // Create mock structure if needed
//   useEffect(() => {
//     if (
//       courseData &&
//       (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0)
//     ) {
//       createMockCourseStructure()
//     }
//   }, [courseData])

//   useEffect(() => {
//     if (userData && courseData) {
//       setIsEnrolled(userData.enrolledCourses?.includes(courseData._id))
//     }
//   }, [userData, courseData])

//   const toggleSection = (index) => {
//     setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
//   }

//   const retryFetch = () => {
//     setError(null)
//     setApiAttempts(0)
//     fetchCourseData()
//   }

//   if (loading) return <Loading />

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
//         <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Course</h2>
//         <p className="text-gray-700 mb-6">{error}</p>
//         <div className="flex gap-4">
//           <button
//             onClick={retryFetch}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     )
//   }

//   if (!courseData) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Not Found</h2>
//         <p className="text-gray-700 mb-6">The course you're looking for doesn't exist or has been removed.</p>
//         <button
//           onClick={() => navigate("/")}
//           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Back to Home
//         </button>
//       </div>
//     )
//   }

//   // Ensure courseContent is an array
//   const courseContent = Array.isArray(courseData.courseContent) ? courseData.courseContent : []

//   const discountedPrice = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)

//   return (
//     <>
//       <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 md:pt-30 pt-20 text-left">
//         <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradien-to-b from-cyan-100/70"></div>
//         <div className="max-w-xl z-10 text-gray-500">
//           <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
//             {courseData.courseTitle || "Course Title"}
//           </h1>
//           <div
//             dangerouslySetInnerHTML={{
//               __html: courseData.courseDescription?.slice(0, 200) || "No description available",
//             }}
//             className="pt-4 md:text-base text-sm"
//           ></div>

//           <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
//             <p>{calculateRating ? calculateRating(courseData) : "0"}</p>
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <img
//                   key={i}
//                   src={
//                     i < Math.floor(calculateRating ? calculateRating(courseData) : 0) ? assets.star : assets.star_blank
//                   }
//                   alt=""
//                   className="w-3.5 h-3.5"
//                 />
//               ))}
//             </div>
//             <p className="text-blue-600">
//               ({courseData.courseRatings?.length || 0} {courseData.courseRatings?.length !== 1 ? "ratings" : "rating"})
//             </p>
//             <p>
//               {courseData.enrolledStudents?.length || 0}{" "}
//               {courseData.enrolledStudents?.length !== 1 ? "Students" : "Student"}
//             </p>
//           </div>

//           <p className="text-sm">
//             Course by <span className="text-blue-600 underline">{courseData.educator?.name || "Instructor"}</span>
//           </p>

//           <div className="pt-8 text-gray-800">
//             <h2 className="text-xl font-semibold">Course Structure</h2>
//             {courseContent.length > 0 ? (
//               <div className="pt-5">
//                 {courseContent.map((chapter, index) => (
//                   <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
//                       onClick={() => toggleSection(index)}
//                     >
//                       <div className="flex items-center gap-2">
//                         <img
//                           src={assets.down_arrow_icon || "/placeholder.svg"}
//                           alt=""
//                           className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
//                         />
//                         <p className="font-medium md:text-base text-sm">
//                           {chapter.chapterTitle || `Chapter ${index + 1}`}
//                         </p>
//                       </div>
//                       <p className="text-sm md:text-default">
//                         {chapter.chapterContent?.length || 0} lectures -{" "}
//                         {calculateChapterTime ? calculateChapterTime(chapter) : "0 min"}
//                       </p>
//                     </div>

//                     <div
//                       className={`overflow-hidden transition-all duration-300 
//                             ${openSections[index] ? "max-h-96" : "max-h-0"} `}
//                     >
//                       {Array.isArray(chapter.chapterContent) && chapter.chapterContent.length > 0 ? (
//                         <ul
//                           className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600
//                               border-t border-gray-300"
//                         >
//                           {chapter.chapterContent.map((lecture, i) => (
//                             <li key={i} className="flex items-start gap-2 py-1">
//                               <img src={assets.play_icon || "/placeholder.svg"} alt="" className="w-4 h-4 mt-1" />
//                               <div
//                                 className="flex items-center justify-between w-full
//                                     text-gray-800 text-xs md:text-default"
//                               >
//                                 <p>{lecture.lectureTitle || `Lecture ${i + 1}`}</p>
//                                 <div className="flex gap-2">
//                                   {lecture.isPreviewFree && (
//                                     <p
//                                       onClick={() =>
//                                         setPlayerData({
//                                           videoId: lecture.lectureUrl ? lecture.lectureUrl.split("/").pop() : "",
//                                         })
//                                       }
//                                       className="text-blue-500 cursor-pointer"
//                                     >
//                                       Preview
//                                     </p>
//                                   )}
//                                   <p>
//                                     {humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, {
//                                       units: ["h", "m"],
//                                     })}
//                                   </p>
//                                 </div>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <div className="px-4 py-2 text-gray-500 border-t border-gray-300">
//                           No lectures available in this chapter.
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
//                 <p className="text-gray-600">
//                   No course structure available yet. This course is still being developed.
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className="py-20 text-sm md:text-default">
//             <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
//             {courseData.courseDescription ? (
//               <div dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} className="pt-3 rich-text"></div>
//             ) : (
//               <p className="pt-3 text-gray-600">
//                 Detailed course description will be available soon. Stay tuned for updates!
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
//           {playerData ? (
//             <Youtube
//               videoId={playerData.videoId}
//               opts={{
//                 playerVars: { autoplay: 1 },
//               }}
//               iframeClassName="w-full aspect-video"
//             />
//           ) : (
//             <img
//               src={courseData.courseThumbnail || "/placeholder.svg"}
//               alt=""
//               className="w-full aspect-video object-cover"
//             />
//           )}

//           <div className="p-5">
//             <div className="flex items-center gap-2">
//               <img
//                 className="w-3.5"
//                 src={assets.time_left_clock_icon || "/placeholder.svg"}
//                 alt="time left clock icon"
//               />
//               <p className="text-red-500">
//                 <span className="font-medium">5 days</span> left at this price!
//               </p>
//             </div>

//             <div className="flex gap-3 items-center pt-2">
//               <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
//                 {currency}
//                 {discountedPrice}
//               </p>
//               <p className="md:text-lg text-gray-500 line-through">
//                 {currency}
//                 {courseData.coursePrice}
//               </p>
//               <p className="md:text-lg text-gray-500">{courseData.discount}% off</p>
//             </div>

//             {!isEnrolled && (
//               <div className="mt-4 flex flex-col gap-3">
//                 <button
//                   className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-colors"
//                   onClick={initiateRazorPayPayment}
//                   disabled={paymentLoading}
//                 >
//                   {paymentLoading ? (
//                     <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                       <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
//                       <path
//                         fillRule="evenodd"
//                         d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                   Pay with RazorPay
//                 </button>

//                 <button
//                   className="w-full py-3 rounded bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center gap-2 transition-colors"
//                   onClick={simulateTestPayment}
//                   disabled={paymentLoading}
//                 >
//                   {paymentLoading ? (
//                     <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                       <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
//                       <path
//                         fillRule="evenodd"
//                         d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                   Test Payment (Simulate)
//                 </button>
//               </div>
//             )}

//             {isEnrolled && (
//               <button
//                 className="md:mt-6 mt-4 w-full py-3 rounded bg-green-600 text-white font-medium"
//                 onClick={() => navigate(`/player/${courseData._id}`)}
//               >
//                 Go to Course
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default CourseDetails

import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/footer';
import Rating from '../../components/student/Rating';
import { toast } from 'react-toastify';
import axios from 'axios';

const CourseDetails = () => {
  const { id } = useParams();
  const { currency, allCourses, calculateRating, calculateCourseDuration, calculateNoOfLectures, getToken, backendUrl } = useContext(AppContext);
  const [courseData, setCourseData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const course = allCourses.find(course => course._id === id);
      if (course) {
        setCourseData(course);
      }
    }
  }, [allCourses, id]);

  const handlePayment = async () => {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const { payuData } = response.data;
        const options = {
          key: payuData.key,
          amount: payuData.amount * 100,
          currency: "INR",
          name: "Edemy Course",
          description: payuData.productinfo,
          order_id: payuData.txnid,
          handler: async function (response) {
            try {
              const verifyResponse = await axios.post(
                `${backendUrl}/api/user/verify-payment`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId: courseData._id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (verifyResponse.data.success) {
                toast.success("Payment successful!");
                setIsEnrolled(true);
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(response.data.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment initiation failed");
    }
  };

  return courseData ? (
    <>
      <div className='md:px-32 px-8 pt-10'>
        <div className='flex md:flex-row flex-col gap-10'>
          {/* Left Column */}
          <div className='md:w-7/12 space-y-5'>
            <h1 className='md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800'>{courseData.courseTitle}</h1>
            <div className='flex items-center gap-2'>
              <p>{calculateRating(courseData)}</p>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />
                ))}
              </div>
              <p className='text-gray-500'>({courseData.courseRatings.length} ratings)</p>
            </div>
            <div className='flex items-center gap-3 text-gray-500'>
              <p>{calculateNoOfLectures(courseData)} lectures</p>
              <div className='h-1 w-1 bg-gray-500 rounded-full'></div>
              <p>{calculateCourseDuration(courseData)}</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} className='rich-text'></div>
          </div>

          {/* Right Column */}
          <div className='md:w-5/12 space-y-5'>
            <img src={courseData.courseThumbnail} alt='' className='w-full rounded-lg' />
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <p className='text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                <p className='line-through text-gray-500'>{currency}{courseData.coursePrice}</p>
                <p>{courseData.discount}% off</p>
              </div>
              {!isEnrolled ? (
                <button
                  onClick={handlePayment}
                  className='bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700'
                >
                  Pay with Razorpay
                </button>
              ) : (
                <button className='bg-green-600 text-white w-full py-2 rounded cursor-not-allowed'>
                  Already Enrolled
                </button>
              )}
            </div>
            <div className='border rounded p-3 space-y-3'>
              <h2 className='font-semibold'>This course includes:</h2>
              <div className='space-y-2 text-gray-500'>
                <div className='flex items-center gap-2'>
                  <img src={assets.time_clock_icon} alt='' />
                  <p>{calculateCourseDuration(courseData)} hours</p>
                </div>
                <div className='flex items-center gap-2'>
                  <img src={assets.lesson_icon} alt='' />
                  <p>{calculateNoOfLectures(courseData)} lectures</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className='flex items-center gap-2 py-3 mt-10'>
          <h1 className='text-l font-bold'>Rate this Course:</h1>
          <Rating initialRating={0} />
        </div>
      </div>
      <Footer />
    </>
  ) : null;
};

export default CourseDetails;