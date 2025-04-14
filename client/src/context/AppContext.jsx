import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from "@clerk/clerk-react"
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    // const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const { getToken } = useAuth()
    const { user } = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    // fetch all courses
    const fetchAllCourses = async () => {
        try {
            // setLoading(true)
            const {data} = await axios.get('http://localhost:5000/api/course/all')
            
            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        }
         catch (error) 
         {
            toast.error(error.message)


        }
      
    }

    const fetchUserData = async () => {
        if (user.publicMetadata.role === 'educator')
        {
            setIsEducator(true)
        }

        try {
            const token = await getToken()
            const {data} = await axios.get('http://localhost:5000/api/user/data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                setUserData(data.user)
                setIsEducator(user.publicMetadata.role === 'educator')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

           
        }
    }

    const fetchUserEnrolledCourses = async () => {
        try {
            
            const token = await getToken()
            console.log("Token:", token)
        // console.log("Backend URL:", backendUrl)
            const {data} = await axios.get('http://localhost:5000/api/user/enrolled-courses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
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

    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()

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
        fetchAllCourses,
        loading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
  
    
