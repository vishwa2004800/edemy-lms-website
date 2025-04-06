// import React, { useContext, useEffect, useState } from 'react'
// // import { dummyStudentEnrolled } from '../../assets/assets'
// import Loading from '../../components/student/Loading'
// import { AppContext } from '../../context/AppContext'
// import { toast } from 'react-toastify'
// import axios from 'axios'


// const StudentsEnrolled = () => {

//   const {backendUrl,getToken, isEducator} = useContext(AppContext) 

//   const [enrolledStudents, setEnrolledStudents] = useState(null)

//   // fetch data from dummy data

//   const fetchEnrolledStudents = async()=> {
//     try{
//       const token = await getToken()
//       const {data} = await axios.get(backendUrl + '/api/educator/enrolled-students',
//         {headers: {Authorization: `Bearer ${token}`}}
//       )

//       if(data.success)
//       {
//         setEnrolledStudents(data.enrolledStudents.reverse())
//       }
//       else
//       {
//         toast.error(data.message)
//       }

//     }
//     catch(error){
//       toast.error(error.message)

//     }
//   }

//   useEffect(()=> {
//     if(isEducator)
//     {
//       fetchEnrolledStudents()

//     }
//   }, [isEducator])

//   return enrolledStudents ? (
//     <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0
//     p-4 pt-8 pb-0  '>
//       <div className='flex flex-col'>
//         <table>
//           <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
//           <tr>
//             <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'> #
//             </th>
//             <th className='px-4 py-3 font-semibold'>Student Name</th>
//             <th className='px-4 py-3 font-semibold'>Course Title</th>
//             <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
//           </tr>


//           </thead>
//           <tbody className='text-sm text-gray-500'>
//  {enrolledStudents.map((item, index) => (
//    <tr key={index} className="border-b border-gray-500/20">
//      <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
//      <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
//        <img
//          src={item.student.imageUrl}
//          alt=""
//          className="w-9 h-9 rounded-full"
//        />
//        <span className="truncate">{item.student.name}</span>
//      </td>
//      <td className="px-4 py-3 truncate">{item.courseTitle}</td>
//      <td className="px-4 py-3 hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString()}</td>
//    </tr>
//  ))}
// </tbody>
//         </table>
//       </div>
//     </div>
//   ) : <Loading/>
// }

// export default StudentsEnrolled
import React, { useContext, useEffect, useState } from 'react'
// import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null)
  
  // fetch data from backend
  const fetchEnrolledStudents = async() => {
    try {
      const token = await getToken()
      const { data } = await axios.get(
        backendUrl + '/api/educator/enrolled-students',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if(data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
      }
    } catch(error) {
      toast.error(error.message)
    }
  }
  
  useEffect(() => {
    if(isEducator) {
      fetchEnrolledStudents()
    }
  }, [isEducator])
  
  return enrolledStudents ? (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">#</th>
            <th className="py-3 px-4 text-left">Student Name</th>
            <th className="py-3 px-4 text-left">Course Title</th>
            <th className="py-3 px-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {enrolledStudents.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">{item.student?.name || 'N/A'}</td>
              <td className="py-3 px-4">{item.courseTitle || 'N/A'}</td>
              <td className="py-3 px-4">
                {item.enrollmentDate 
                  ? new Date(item.enrollmentDate).toLocaleDateString() 
                  : item.createdAt 
                    ? new Date(item.createdAt).toLocaleDateString()
                    : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : <Loading />
}

export default StudentsEnrolled