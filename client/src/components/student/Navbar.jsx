
import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { UserButton,useClerk,useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {

    const {navigate, isEducator,backendUrl, setIsEducator, getToken} = useContext(AppContext)
    const iscourseListPage = location.pathname.includes('/course-list'); 

    const {openSignIn} = useClerk()
    const {user} = useUser()

    const becomeEducator = async () => {
        try {
            if (isEducator) {
                navigate('/educator')
                return;
            }
    
            const token = await getToken()
            const { data } = await axios.get('/api/educator/update-role',
            {headers: {Authorization: `Bearer ${token}`, 'Content-Type':'application/json',
        'Accept':'application/json'}})

            console.log("API Response:", data);
    
            if (data.success){
                setIsEducator(true)
                toast.success(data.message)
                navigate('/educator')
                console.log("Updated isEducator:", true); 
            }
            else{
                toast.error(data.message)
            }
    
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    

    return (
        <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500
        py-4 ${iscourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`} > {/* Fixed syntax */}
            <img onClick={()=> navigate('/')} src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer' />
            <div className='hidden md:flex items-center gap-5 text-gray-500'> {/* Fixed 'item-center' to 'items-center' */}
                <div className='flex items-center gap-5'>
                    { user &&
                    <>
                        <button onClick={becomeEducator}>
                        {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                    </button>
                     | <Link to='/myenroll'>
                        My Enrollments
                    </Link>
                    </>}
                </div>
                { user ? <UserButton/> : 
                    <button  onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
            </div>

            {/* for small screen */}


            <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
                <div className='flex item-center gap-1 sm:gap-2 max-sm:text-xs'>
                { user &&
                    <>
                        <button onClick={becomeEducator}>
                        {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                    </button>
                     | <Link to='/myenroll'>
                        My Enrollments
                    </Link>
                    </>}
                </div>
                {
                    user ? <UserButton/> :
                    <button onClick={() => openSignIn()}>
                    <img src={assets.user_icon} alt="user-icon" />
                </button>}

            </div>
        </div>
    )
}

export default Navbar
