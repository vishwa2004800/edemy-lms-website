

import React, { useState, useRef, useEffect, useContext } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import axios from "axios";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // State variables
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currChapId, setCurrChapId] = useState(null);

  const [lecDetails, setLecDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrChapId(chapterId);
      setShowPopup(true); // Show the popup
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedContent = [...chapter.chapterContent];
            updatedContent.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedContent };
          }
          return chapter;
        })
      );
      toast.success("Lecture removed successfully");
    }
  };

  const handleSaveLecture = () => {
    if (!lecDetails.lectureTitle || !lecDetails.lectureDuration || !lecDetails.lectureUrl) {
      toast.error("Please fill in all lecture details");
      return;
    }

    if (currChapId) {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === currChapId) {
            const newLecture = {
              ...lecDetails,
              lectureOrder:
                chapter.chapterContent.length > 0
                  ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                  : 1,
              lectureId: uniqid(),
            };
            return {
              ...chapter,
              chapterContent: [...chapter.chapterContent, newLecture],
            };
          }
          return chapter;
        })
      );
      
      setLecDetails({
        lectureTitle: "",
        lectureDuration: "",
        lectureUrl: "",
        isPreviewFree: false,
      });
      
      setShowPopup(false);
      toast.success("Lecture added successfully");
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      
      if (!courseTitle) {
        toast.error("Course title is required");
        return;
      }
      
      if (!image) {
        toast.error("Thumbnail not selected");
        return;
      }
      
      if (chapters.length === 0) {
        toast.error("Please add at least one chapter");
        return;
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type':"multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        // Reset form after successful submission
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form id="courseForm" className="flex flex-col gap-4 max-w-md w-full text-gray-500" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
              required
            />
          </div>

          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img
                src={assets.file_upload_icon}
                alt=""
                className="p-3 bg-blue-500 rounded"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              <img
                className="max-h-10"
                src={image ? URL.createObjectURL(image) : ""}
                alt=""
              />
            </label>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>
      </form>

      <div className="w-full mt-6">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <img
                  src={assets.dropdown_icon}
                  width={14}
                  alt=""
                  className={`mr-2 cursor-pointer transition-all ${chapter.collapsed ? "-rotate-90" : ""}`}
                  onClick={() => handleChapter("toggle", chapter.chapterId)}
                />
                <span className="font-semibold">
                  {chapterIndex + 1}. {chapter.chapterTitle}
                </span>
              </div>
              <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>
              <img
                src={assets.cross_icon}
                alt=""
                className="cursor-pointer"
                onClick={() => handleChapter("remove", chapter.chapterId)}
              />
            </div>
            {!chapter.collapsed && (
              <div className="p-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div key={lecture.lectureId} className="flex justify-between items-center mb-2">
                    <span>
                      {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -
                      <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">
                        Link
                      </a>
                      - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                    </span>
                    <img
                      src={assets.cross_icon}
                      alt=""
                      className="cursor-pointer"
                      onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)}
                    />
                  </div>
                ))}
                <div
                  className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                  onClick={() => handleLecture("add", chapter.chapterId)}
                >
                  Add Lectures
                </div>
              </div>
            )}
          </div>
        ))}
        <div
          className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
          onClick={() => handleChapter("add")}
        >
          + Add Chapter
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
              <div className="mb-3">
                <p>Lecture Title</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-2 px-3"
                  value={lecDetails.lectureTitle}
                  onChange={(e) => setLecDetails({ ...lecDetails, lectureTitle: e.target.value })}
                  placeholder="Enter lecture title"
                />
              </div>

              <div className="mb-3">
                <p>Duration (minutes)</p>
                <input
                  type="number"
                  className="mt-1 block w-full border rounded py-2 px-3"
                  value={lecDetails.lectureDuration}
                  onChange={(e) => setLecDetails({ ...lecDetails, lectureDuration: e.target.value })}
                  placeholder="Enter duration in minutes"
                />
              </div>

              <div className="mb-3">
                <p>Lecture URL</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-2 px-3"
                  value={lecDetails.lectureUrl}
                  onChange={(e) => setLecDetails({ ...lecDetails, lectureUrl: e.target.value })}
                  placeholder="Enter video URL"
                />
              </div>

              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="isPreviewFree"
                  checked={lecDetails.isPreviewFree}
                  onChange={(e) => setLecDetails({ ...lecDetails, isPreviewFree: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isPreviewFree">Free Preview</label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSaveLecture}
                >
                  Add
                </button>
              </div>

              <img
                src={assets.cross_icon}
                alt=""
                className="absolute top-4 right-4 w-4 cursor-pointer"
                onClick={() => setShowPopup(false)}
              />
            </div>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        form="courseForm" 
        className="bg-black text-white w-max py-2.5 px-8 rounded my-9"
      >
        ADD
      </button>
    </div>
  );
};

export default AddCourse;