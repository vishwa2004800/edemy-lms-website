
// import React, { useState, useEffect, useContext } from 'react'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { AppContext } from '../../context/AppContext'

// const StudyPlanner = ({ courseId, currentLecture }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [plans, setPlans] = useState([])
//   const [selectedLecture, setSelectedLecture] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const {getToken, user} = useContext(AppContext)

//   // Update selectedLecture whenever currentLecture changes
//   useEffect(() => {
//     if (currentLecture) {
//       setSelectedLecture(currentLecture)
//     }
//   }, [currentLecture])

//   const scheduleLecture = async () => {
//     try {
//       setLoading(true)
//       const lectureToSchedule = selectedLecture || currentLecture
      
//       if(!lectureToSchedule) {
//         toast.error('Please select a lecture before scheduling!')
//         return
//       }
      
//       // Try to find a valid ID using various possible property names
//       const lectureId = lectureToSchedule.lectureId || lectureToSchedule.id || lectureToSchedule._id
      
//       if(!lectureId) {
//         toast.error('Cannot find lecture ID. Please select a lecture again.')
//         console.error("Lecture object structure:", lectureToSchedule)
//         return
//       }
      
//       const token = await getToken()
//       if(!token) {
//         toast.error('Authentication error please Login in again')
//         return
//       }
//       const userName = user?.name || 'Anonymous'

//       // Store lecture title to use when displaying plans
//       const lectureTitle = lectureToSchedule.lectureTitle || lectureToSchedule.name || lectureToSchedule.title || 'Untitled Lecture'
      
//       console.log("Scheduling lecture with data:", {
//         courseId,
//         lectureId,
//         lectureTitle,
//         scheduledDate: selectedDate
//       })
      
//       const response = await axios.post(
//         'http://localhost:5000/api/study-plan/add',
//         {
//           courseId,
//           lectureId: lectureId,
//           scheduledDate: selectedDate,
//           lectureName: lectureTitle ,
//           userName: userName, // <- NEW LINE

//           // Make sure to pass the lecture name to the API
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
      
//       console.log("API response for scheduling:", response.data)
      
//       if (response.data.success) {
//         toast.success('Lecture scheduled!')
//         await fetchPlans()
//       } else {
//         toast.error(response.data.message || 'Failed to schedule lecture')
//       }
//     } catch (error) {
//       console.error("Error scheduling lecture:", error.response?.data || error)
//       toast.error('Failed to schedule lecture')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchPlans = async () => {
//     try {

//       // setLoading(true)
//       const token = await getToken()
      
//       console.log("Fetching plans with token:", token ? "Token exists" : "No token")
      
//       const res = await axios.get('http://localhost:5000/api/study-plan/my-plans', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       console.log("Plans fetched:", res.data.plans) // ← Move here

      
//       console.log("Raw API response from fetchPlans:", res.data)
      
//       if (res.data.success) {
//         console.log("Setting plans state with:", res.data.plans)
//         setPlans(res.data.plans || [])

        
//         // Manually inspect the returned data structure
//         if (res.data.plans && res.data.plans.length > 0) {
//           console.log("First plan structure:", JSON.stringify(res.data.plans[0], null, 2))
//         }
//       } else {
//         console.error("Failed to fetch plans:", res.data.message)
//       }
//     } catch (error) {
//       console.error("Error fetching plans:", error.response?.data || error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch plans when component mounts and whenever a new lecture is scheduled
//   useEffect(() => {
//     if (courseId) {
//       console.log("Initial fetch of plans for courseId:", courseId)
//       fetchPlans()
//     }
//   }, [courseId])

//   // Get the title of the currently selected lecture
//   const getCurrentLectureTitle = () => {
//     const lecture = selectedLecture || currentLecture
//     if (!lecture) return null
//     return lecture.lectureTitle || lecture.name || lecture.title
//   }

//   const lectureTitle = getCurrentLectureTitle()

//   return (
//     <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
//       <h2 className="text-lg font-semibold mb-2">📅 Schedule this Lecture</h2>
      
//       {/* Show currently selected lecture if available */}
//       {lectureTitle && (
//         <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-100">
//           <p className="text-sm font-medium">
//             Currently selected: {lectureTitle}
//           </p>
//         </div>
//       )}

//       <div className="flex items-center gap-3 mb-4">
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           showTimeSelect
//           dateFormat="Pp"
//           className="border px-3 py-2 rounded w-64"
//         />
//         <button
//           onClick={scheduleLecture}
//           className="text-white px-4 py-2 rounded bg-blue-700 transition"
//         >
//           {/* {Loading ? 'Scheduling...' : 'Schedule'} */}
//           Schedule
//         </button>
//       </div>

//       <h3 className="font-semibold text-md mb-2">
//         📚 My Study Plan 
//         <button 
//           onClick={fetchPlans} 
//           className="ml-2 text-xs text-blue-600 hover:underline"
//         >
//         </button>
//       </h3>
      
     
      
//       {!plans || plans.length === 0 ? (
//         <p className="text-gray-500 text-sm">No scheduled lectures yet.</p>
//       ) : (
//         <ul className="space-y-2 max-h-60 overflow-y-auto">
//           {plans.map((plan, index) => {
//             // Extract lecture name - try multiple possible structures
//             // let lectureName = 'Untitled'
//             let lectureName = plan.lectureName || (typeof plan.lectureId === 'object' && plan.lectureId?.name) || 'Introduction'

//             const userName = plan.userName || 'Unknown Student'

//             if (typeof plan.lectureId != 'object' && plan.lectureId?.name) {
//               lectureName = plan.lectureId.name
//             } else if (plan.lectureName) {
//               lectureName = plan.lectureName
//             }
            
           
//           })}
//         </ul>
//       )}
//     </div>
//   )
// }

// export default StudyPlanner
import React, { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const StudyPlanner = ({ courseId, currentLecture }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [plans, setPlans] = useState([])
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [loading, setLoading] = useState(false)
  // const { getToken} = useContext(AppContext)

  useEffect(() => {
    if (currentLecture) {
      setSelectedLecture(currentLecture)
    }
  }, [currentLecture])

  const scheduleLecture = async () => {
    try {
      setLoading(true)
      const lectureToSchedule = selectedLecture || currentLecture

      if (!lectureToSchedule) {
        toast.error('Please select a lecture before scheduling!')
        return
      }

      const lectureId = lectureToSchedule.lectureId || lectureToSchedule.id || lectureToSchedule._id

      if (!lectureId) {
        toast.error('Cannot find lecture ID. Please select a lecture again.')
        return
      }

      const lectureTitle = lectureToSchedule.lectureTitle || lectureToSchedule.name || lectureToSchedule.title || 'Untitled Lecture'

      // Simulate scheduling success (no API call)
      const newPlan = {
        courseId,
        lectureId,
        lectureName: lectureTitle,
        scheduledDate: selectedDate,
        // userName
      }

      // Add to plans locally
      setPlans((prevPlans) => [...prevPlans, newPlan])
      toast.success('Lecture scheduled')

    } catch (error) {
      console.error("Error scheduling lecture:", error)
      toast.error('Failed to schedule lecture')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLectureTitle = () => {
    const lecture = selectedLecture || currentLecture
    if (!lecture) return null
    return lecture.lectureTitle || lecture.name || lecture.title
  }

  const lectureTitle = getCurrentLectureTitle()

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">📅 Schedule this Lecture</h2>

      {lectureTitle && (
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-100">
          <p className="text-sm font-medium">
            Currently selected: {lectureTitle}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="border px-3 py-2 rounded w-64"
        />
        <button
          onClick={scheduleLecture}
          className="text-white px-4 py-2 rounded bg-blue-700 transition"
        >
          {loading ? 'Scheduling...' : 'Schedule'}
        </button>
      </div>

      <h3 className="font-semibold text-md mb-2">📚 My Study Plan</h3>

      {!plans || plans.length === 0 ? (
        <p className="text-gray-500 text-sm">No scheduled lectures yet.</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {plans.map((plan, index) => (
            <li key={index} className="p-3 bg-gray-100 rounded-md border">
              <p className="text-sm font-medium">📖 {plan.lectureName}</p>
              <p className="text-xs text-gray-600">📅 {new Date(plan.scheduledDate).toLocaleString()}</p>
              {/* <p className="text-xs text-gray-600">👤 {plan.userName}</p> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudyPlanner
