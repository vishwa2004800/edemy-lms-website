import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
// import getToken from '../utils/getToken'

const StudyPlanner = ({ courseId, currentLecture }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [plans, setPlans] = useState([])
  const {getToken} = useContext(AppContext)

  const scheduleLecture = async () => {
    try {
      if(!currentLecture || !currentLecture.id)
      {
        toast.error('Please select a lecture before scheduling!')
        return;
      }
      const token = await getToken()
      const res = await axios.post(
        'http://localhost:5000/api/study-plan/add',
        {
          courseId,
          lectureId: currentLecture.id,
          scheduledDate: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Lecture scheduled!')
      fetchPlans()
    } catch (error) {
      console.error(error)
      toast.error('Failed to schedule lecture')
    }
  }

  const fetchPlans = async () => {
    try {
      const token = await getToken()
      const res = await axios.get('http://localhost:5000/api/study-plan/my-plans', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success) setPlans(res.data.plans)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">📅 Schedule this Lecture</h2>

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Schedule
        </button>
      </div>

      <h3 className="font-semibold text-md mb-2">📚 My Study Plan</h3>
      {plans.length === 0 ? (
        <p className="text-gray-500 text-sm">No scheduled lectures yet.</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {plans.map((plan) => (
            <li key={plan._id} className="border p-3 rounded bg-gray-50">
              <p className="text-sm text-gray-800">
                <strong>Lecture:</strong> {plan.lectureId?.name || 'Untitled'}
              </p>
              <p className="text-xs text-gray-600">
                <strong>When:</strong> {new Date(plan.scheduledDate).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudyPlanner
