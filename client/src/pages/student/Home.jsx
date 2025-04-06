import React from 'react'
import Hero from '../../components/student/hero'
import Companies from '../../components/student/companies'
import CourseSection from '../../components/student/courseSection'
import Testimonial from '../../components/student/testimonial'
import CallToAction from '../../components/student/callToaction'
import Footer from '../../components/student/footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero/>
      <Companies/>
      <CourseSection/>
      <Testimonial/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default Home
