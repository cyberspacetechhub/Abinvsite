import usePost from "../../../../hooks/usePost";
import useAuth from "../../../../hooks/useAuth";
import baseUrl from "../../../../shared/baseURL";
import Modal from "@mui/material/Modal";
import { set, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useUpdate from "../../../../hooks/useUpdate";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import axios from 'axios';


const CreateLessonModal = ({ open, handleClose, topicId }) => {
  const post = usePost();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const uploadUrl = `${baseUrl}lesson/upload`;
  const lessonUrl = `${baseUrl}lesson`;
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ mode: "all" });

  const uploadImage = async (file) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });
      setImageUrl(response.data.url);
      setValue('imageUrl', response.data.url);
      toast.success('Image uploaded successfully');
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Failed to upload image');
      // console.error('Image upload error:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const createLesson = async (lesson) => {
    setIsLoading(true);
    const data = { ...lesson, topicId, imageUrl };
    const response = await post(lessonUrl, data, auth?.accessToken);
    setTimeout(() => {
      setIsLoading(false);
      handleClose();
    }, 3000);
    // console.log(response.data);
  };

  const { mutate } = useMutation(createLesson, {
    onSuccess: () => {
      queryClient.invalidateQueries('topic');
    }
  });

  const handleLessonCreate = (lesson) => {
    mutate(lesson);
    toast.success('Lesson Created Successfully');
    setIsLoading(false);
  };


 // console.log(data)

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <!-- Main modal --> */}
      <div
        id="defaultModal"
        className=" overflow-y-auto overflow-x-hidden absolute top-[5%]   right-1/4 z-50 justify-center items-center w-2/4  h-modal md:h-full"
      >
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          {/* <!-- Modal content --> */}
          <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            {/* <!-- Modal header --> */}
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Lesson
              </h3>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                }}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <form onSubmit={handleSubmit(handleLessonCreate)}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                  <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"/>

                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    {...register("title", { required: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type lesson title "
                    required=""
                  />
                  {errors.title && (
                    <p className="text-sm text-red-400">
                      title is required
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subTitle"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    subTitle
                  </label>
                  <input
                    type="text"
                    name="subTitle"
                    id="subTitle"
                    {...register("subTitle")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type subTitle"
                    required=""
                  />
                  {errors.subTitle && (
                    <p className="text-sm text-red-400">
                      subTitle is required
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="index"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Index
                  </label>
                  <input
                    type="number"
                    name="index"
                    id="index"
                    {...register("index", { required: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type topic index"
                    required=""
                  />
                  {errors.index && (
                    <p className="text-sm text-red-400">
                      Index is required
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="body"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Body
                  </label>
                  <textarea
                    id="body"
                    rows="4"
                    {...register("body", { required: true })}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Write lesson body here"
                  ></textarea>
                  {errors.body && (
                    <p className="text-sm text-red-400">
                      lesson body is required 
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="imageUrl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image Url</label>
                  <input value={imageUrl} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"/>
                  
                </div>
              </div>
              <button
                type="submit"
                className="text-gray-600 inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                <svg
                  className="mr-1 -ml-1 w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                 {isLoading ? <CircularProgress size="18px" style={{color: "green"}} />: "Create New Lesson"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateLessonModal;
