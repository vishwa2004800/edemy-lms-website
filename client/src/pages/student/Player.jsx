import { useEffect, useState } from "react"
import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import { useParams } from "react-router-dom"
import { assets } from "../../assets/assets"
import humanizeDuration from "humanize-duration"
import YouTube from "react-youtube"
import Footer from "../../components/student/footer"
import Rating from "../../components/student/Rating"
import { toast } from "react-toastify"
import Loading from "../../components/student/Loading"
import axios from "axios"
import { Pencil, Save, Trash2 } from "lucide-react"
import StudyPlanner from "../../components/student/StudyPlanner"


const Player = () => {
  const { enrolledCourses, calculateChapterTime, getToken, userData, fetchUserEnrolledCourses } = useContext(AppContext)
  const { courseId } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)

  // Notes related state
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editNoteText, setEditNoteText] = useState("")

  const getCourseData = () => {
    const course = enrolledCourses.find((course) => course._id === courseId)
    if (course) {
      setCourseData(course)
      course.courseRatings.map((item) => {
        if (item.userId == userData._id) {
          setInitialRating(item.rating)
        }
      })
    } else {
      console.error("Course not found with ID:", courseId)
    }
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData()
    }
    console.log("Enrolled courses:", enrolledCourses)
  }, [enrolledCourses])

  const markComplete = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        "http://localhost:5000/api/user/update-progress",
        {
          courseId,
          lectureId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (data.success) {
        toast.success(data.message)
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        "http://localhost:5000/api/user/get-progress",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (data.success) {
        setProgressData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRate = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        "http://localhost:5000/api/user/add-rating",
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Notes related functions


  const fetchNotes = async () => {
    try {
      const token = await getToken()
      console.log("Fetching notes for courseId:", courseId)

      const { data } = await axios.get(`http://localhost:5000/api/notes/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (data.success) {
        console.log("Notes fetched successfully:", data.notes)
        setNotes(data.notes)
      } else {
        console.error("Failed to fetch notes:", data.message)
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error fetching notes:", error.response?.data || error.message)
      toast.error("Failed to fetch notes. Please try again later.")
    }
  }

  const addNote = async () => {
    if (!noteText.trim()) {
      toast.error("Note cannot be empty")
      return
    }

    try {
      const token = await getToken()
      const { data } = await axios.post(
        "http://localhost:5000/api/notes/add",
        {
          courseId,
          lectureId: playerData?.lectureId || null,
          lectureName: playerData?.lectureTitle || " ",
          content: noteText,
          timestamp: 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (data.success) {
        toast.success("Note added successfully")
        setNoteText("")
        fetchNotes()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to add note")
      console.error(error)
    }
  }

  const deleteNote = async (noteId) => {
    try {
      const token = await getToken()
      const { data } = await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (data.success) {
        toast.success("Note deleted successfully")
        fetchNotes()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to delete note")
      console.error(error)
    }
  }

  const startEditNote = (note) => {
    setEditingNoteId(note._id)
    setEditNoteText(note.content)
  }

  const updateNote = async () => {
    if (!editNoteText.trim()) {
      toast.error("Note cannot be empty")
      return
    }

    try {
      const token = await getToken()
      const { data } = await axios.put(
        `http://localhost:5000/api/notes/${editingNoteId}`,
        {
          content: editNoteText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (data.success) {
        toast.success("Note updated successfully")
        setEditingNoteId(null)
        fetchNotes()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to update note")
      console.error(error)
    }
  }

  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const seekToTimestamp = (seconds) => {
    if (document.querySelector("iframe")?.contentWindow?.player) {
      document.querySelector("iframe").contentWindow.player.seekTo(seconds)
    }
  }

  useEffect(() => {
    getCourseProgress()
    fetchNotes()
  }, [courseId])

  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h1 className="text-xl font-semibold">Course Structure</h1>
          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon || "/placeholder.svg"}
                        alt=""
                        className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
                      />
                      <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 
                                  ${openSections[index] ? "max-h-96" : "max-h-0"} `}
                  >
                    <ul
                      className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600
                                  border-t border-gray-300"
                    >
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={
                              progressData && progressData.lectureCompleted.includes(lecture.lectureId)
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt=""
                            className="w-4 h-4 mt-1"
                          />
                          <div
                            className="flex items-center justify-between w-full
                                        text-gray-800 text-xs md:text-default"
                          >
                            <p> {lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-l font-bold">Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
          <StudyPlanner
          courseId={courseId}
          currentLecture={playerData}
          />

        </div>

        {/* right column */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              <YouTube videoId={playerData.lectureUrl.split("/").pop()} iframeClassName="w-full aspect-video" />

              <div className="flex justify-between items-center mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button onClick={() => markComplete(playerData.lectureId)} className="text-blue-600">
                  {" "}
                  {progressData && progressData.lectureCompleted.includes(playerData.lectureId)
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>

              {/* Notes section */}
              <div className="mt-4 border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">My Notes</h2>
                  <button onClick={() => setShowNotes(!showNotes)} className="text-blue-600 text-sm">
                    {showNotes ? "Hide Notes" : "View All Notes"}
                  </button>
                </div>

                {/* Add note form */}
                <div className="flex gap-2 mb-4">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note about this lecture..."
                    className="w-full p-2 border border-gray-300 rounded-md resize-none"
                    rows="2"
                  />
                  <button
                    onClick={addNote}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md self-end hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>

                {/* Notes list */}
                {showNotes && (
                  <div className="max-h-60 overflow-y-auto">
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <div key={note._id} className="border border-gray-200 rounded-md p-3 mb-2">
                          {editingNoteId === note._id ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={editNoteText}
                                onChange={(e) => setEditNoteText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                                rows="2"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  className="text-gray-600 px-2 py-1 rounded-md hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={updateNote}
                                  className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800">{note.content}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <p className="text-xs text-gray-500">
                                      {note.lectureId ? `Lecture: ${note.lectureName || "Unknown"}` : "Course note"}
                                    </p>
                                    {note.timestamp > 0 && (
                                      <button
                                        onClick={() => seekToTimestamp(note.timestamp)}
                                        className="text-xs text-blue-600 hover:underline"
                                      >
                                        {formatTimestamp(note.timestamp)}
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => startEditNote(note)}
                                    className="text-gray-600 p-1 rounded-md hover:bg-gray-100"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteNote(note._id)}
                                    className="text-red-600 p-1 rounded-md hover:bg-gray-100"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No notes yet. Start adding notes while watching!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} alt="" />
          )}
        </div>
        
      </div>


      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default Player

