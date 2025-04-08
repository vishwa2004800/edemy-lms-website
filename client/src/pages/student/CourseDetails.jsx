

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
  const { currency, allCourses, calculateRating, calculateCourseDuration, calculateNoOfLectures, getToken, userData } = useContext(AppContext);
  const [courseData, setCourseData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openSections,setOpenSections] = useState({}) 
  const [playerData,setPlayerData] = useState(null)


  const fetchCourseData=async()=>{
    try{
      const {data} = await axios.get('http://localhost:5000/api/course/' + id)

      if(data.success)
      {
        setCourseData(data.courseData)
      }
      else
      {
        toast.error(data.message)
      }

    }
    catch(error)
    {
      toast.error(error.message)


    }
  }

  const enrollCourse = async()=>{
    try{
      if(!userData)
      {
        return toast.warn('Login to Enroll')
      }
      if(isEnrolled)
      {
        return toast.warn('Already Enrolled')
      }

      const token = await getToken();
      const {data} = await axios.post('http://localhost:5000/api/user/purchase',
        {
          courseId:courseData._id
        },
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      )
      if(data.success)
      {
        const {session_url} = data
        window.location.replace(session_url)
      }
      else
      {
        toast.error(data.message)
      }

    }
    catch(error)
    {
      toast.error(error.message)


    }
  }

  useEffect(() => {
   fetchCourseData()
  }, []);


  useEffect(() => {
    if(userData && courseData)
    {

      setIsEnrolled(userData?.enrollCourse?.includes(courseData._id) || false)
    }
   }, [userData,courseData]);

   const toggleSection=(index)=>{
    setOpenSections((prev)=>(
      {
      ...prev,
      [index]:!prev[index],
      }
    ))
   }
 
  

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
                  onClick={enrollCourse}
                  className='bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700'
                > Enroll Now
                  
                </button>
              ) : (
                <button className='bg-green-600 text-white w-full py-2 rounded cursor-not-allowed'>
                  Already Enrolled
                </button>
              )}
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