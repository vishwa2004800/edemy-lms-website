import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from "@clerk/clerk-react"
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const { getToken } = useAuth()
    const { user } = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchAllCourses = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${backendUrl}/api/course/all`)
            
            if (response.data.success) {
                setAllCourses(response.data.courses)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching courses")
            console.error("Error fetching courses:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserEnrolledCourses = async () => {

        

        try {
            
            const token = await getToken()
            console.log("Token:", token)
        console.log("Backend URL:", backendUrl)
            const response = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("Full Response:", response)
            console.log("Enrolled Courses:", response.data.enrolledCourses)

            if (response.data.success) {
                setEnrolledCourses(response.data.enrolledCourses)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching enrolled courses")
            console.error("Error fetching enrolled courses:", error)
        }
    }

    const fetchUserData = async () => {
        if (user.publicMetadata.role === 'educator')
        {
            setIsEducator(true)
        }

        try {
            const token = await getToken()
            const response = await axios.get(`${backendUrl}/api/user/data`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                setUserData(response.data.user)
                setIsEducator(user.publicMetadata.role === 'educator')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching user data")
            console.error("Error fetching user data:", error)
        }
    }

    // Calculate rating for a course
    const calculateRating = (course) => {
        if (!course.courseRatings?.length) return 0
        const totalRating = course.courseRatings.reduce((sum, rating) => sum + rating.rating, 0)
        return Math.round(totalRating / course.courseRatings.length)
    }

    // Calculate chapter duration
    const calculateChapterTime = (chapter) => {
        if (!chapter?.chapterContent?.length) return "0m"
        const totalMinutes = chapter.chapterContent.reduce((sum, lecture) => sum + (lecture.lectureDuration || 0), 0)
        return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"] })
    }

    // Calculate total course duration
    const calculateCourseDuration = (course) => {
        if (!course?.courseContent?.length) return "0m"
        let totalMinutes = 0
        course.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                totalMinutes += lecture.lectureDuration || 0
            })
        })
        return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"] })
    }

    // Calculate total lectures in a course
    const calculateNoOfLectures = (course) => {
        if (!course?.courseContent?.length) return 0
        return course.courseContent.reduce((total, chapter) => 
            total + (chapter.chapterContent?.length || 0), 0)
    }

    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()

    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
        }
    }, [user])

    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateNoOfLectures,
        calculateChapterTime,
        calculateCourseDuration,
        enrolledCourses,
        fetchUserEnrolledCourses,
        userData,
        setUserData,
        getToken,
        backendUrl,
        loading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
  
    
