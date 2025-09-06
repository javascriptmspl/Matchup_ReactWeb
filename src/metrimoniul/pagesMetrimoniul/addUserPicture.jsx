// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import user from "../../assets/avatar/add-photos.png";
// import { BASE_URL } from "../../base";
// import { uploadProfilePictureAsync } from "../../dating/store/slice/profileSlice";
// import { useDispatch } from "react-redux";

// const AddPhotos = () => {
//   const [selectedImages, setSelectedImages] = useState([
//     user,user,user,user
//   ]);
//   const [previewImage, setPreviewImage] = useState(user);
// const [selectedFile, setSelectedFile] = useState(null);

//   const navigate = useNavigate();
// const dispatch=useDispatch()
//   // const handleImageClick = (index) => {
//   //   const fileInput = document.createElement("input");
//   //   fileInput.type = "file";
//   //   fileInput.accept = "image/*";

//   //   fileInput.addEventListener("change", (event) => {
//   //     const file = event.target.files[0];
//   //     if (file) {
//   //       const newImages = [...selectedImages];
//   //       newImages[index] = URL.createObjectURL(file);
//   //       setSelectedImages(newImages);
//   //     }
//   //   });

//   //   fileInput.click();
//   // };
//   const getUser = JSON.parse(localStorage.getItem("userData"));
//   const id = getUser?.data?._id;

//   const handleImageClick = () => {
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = "image/*";

//     fileInput.addEventListener("change", (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         setPreviewImage(URL.createObjectURL(file)); // show preview
//         setSelectedFile(file); // keep actual file for upload
//       }
//     });

//     fileInput.click();
//   };

//   const saveSettings = async () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve();
//       }, 2000);
//     });
//   };

//   const submitImages = async () => {
//     if (!selectedFile) {
//       toast.error("Please select an image first.");
//       return;
//     }

//     try {
//       await dispatch(
//         uploadProfilePictureAsync({ imageData: selectedFile, id })
//       ).unwrap();

//       toast.success("Profile picture uploaded successfully!");
//       navigate("/metrimonial");
//     } catch (error) {
//       toast.error("Error uploading image.");
//       console.error(error);
//     }
//   };

//   // const submitImages = async () => {
//   //   try {
//   //     // Simulate a delay using setTimeout
//   //     await new Promise((resolve) => setTimeout(resolve, 100));
//   //     await toast.promise(
//   //       saveSettings(), // Assuming saveSettings is a function to save Partner preference
//   //       {
//   //         loading: 'Saving your images 😍...',
//   //         success: <b>Images saved! Redirecting...  Please Login</b>,
//   //         error: <b>Could not save. Please try again.</b>,
//   //       }
//   //     );
//   //     if (selectedImages.length >= 2) {
//   //       toast.success("Account created successfully!", {});
//   //       navigate("/metrimonial");
//   //     } else {
//   //       toast.error("Please select at least 2 images first.", {});
//   //     }
//   //   } catch (error) {
//   //     // Remove the following line to prevent the error toast
//   //     // toast.error("Error submitting Family details. Please try again.");
//   //   }
//   // }

//   const title = "Add Images";
//   const desc =
//     "Make your dating profile stand out! Add images to showcase your personality and interests. Let others see the real you—upload your best photos now!";

//   const btnText = "See More Popular";

//   return (
//     <div>
//       <div className="member padding-top padding-bottom overflow-hidden">
//         <div className="container">
//           <div
//             className="section__header style-2 text-center wow fadeInUp"
//             data-wow-duration="1.5s"
//           >
//             <h2>{title}</h2>
//             <p>{desc}</p>
//           </div>
//           <div
//             className="section__wrapper wow fadeInUp"
//             data-wow-duration="1.5s"
//           >
//             <div className="member__grid d-flex flex-wrap justify-content-center mx-12-none">
//             {selectedImages.map((image, index) => (
//   <div key={index} className="member__item male pointer px-3">
//     <div
//       className="member__inner"
//       onClick={() => handleImageClick(index)}
//       style={{ width: '260px', height: '300px' }}
//     >

//         <img
//           src={image}
//           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           alt={`Selected Member ${index + 1}`}
//         />
//     </div>
//   </div>
// ))}

//             </div>
//             <div style={{ textAlign: "center" }}>
//               <button className="default-btn reverse mt-5"  onClick={submitImages}>
//                 <span>Submit images</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPhotos;

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import user from "../../assets/avatar/add-photos.png";
import { uploadProfilePictureAsync } from "../../dating/store/slice/profileSlice";
import { useDispatch } from "react-redux";

const AddPhotos = () => {
  const [selectedImages, setSelectedImages] = useState([
    user,
    user,
    user,
    user,
  ]); // UI placeholders
  const [selectedFile, setSelectedFile] = useState(null); // real file for upload

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUser = JSON.parse(localStorage.getItem("userData"));
  const userId = getUser?.data?._id;

  
  const handleImageClick = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const newImages = [...selectedImages];
        newImages[index] = URL.createObjectURL(file); 
        setSelectedImages(newImages);
        setSelectedFile(file); 
      }
    });

    fileInput.click();
  };

  // submit only the last clicked file
  const submitImages = async () => {
    if (!selectedFile) {
      toast.error("Please select at least 1 image.");
      return;
    }

    try {
      await dispatch(
        uploadProfilePictureAsync({ imageData: selectedFile, userId })
      ).unwrap();

      toast.success("Profile picture uploaded successfully!");
      navigate("/metrimonial");
    } catch (error) {
      toast.error("Error uploading image.");
      console.error(error);
    }
  };

  const title = "Add Images";
  const desc =
    "Make your dating profile stand out! Add images to showcase your personality and interests. Let others see the real you—upload your best photos now!";

  return (
    <div>
      <div className="member padding-top padding-bottom overflow-hidden">
        <div className="container">
          <div
            className="section__header style-2 text-center wow fadeInUp"
            data-wow-duration="1.5s"
          >
            <h2>{title}</h2>
            <p>{desc}</p>
          </div>

          <div
            className="section__wrapper wow fadeInUp"
            data-wow-duration="1.5s"
          >
            <div className="member__grid d-flex flex-wrap justify-content-center mx-12-none">
              {selectedImages.map((image, index) => (
                <div key={index} className="member__item male pointer px-3">
                  <div
                    className="member__inner"
                    onClick={() => handleImageClick(index)}
                    style={{ width: "260px", height: "300px" }}
                  >
                    <img
                      src={image}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      alt={`Selected Member ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                className="default-btn reverse mt-5"
                onClick={submitImages}
              >
                <span>Submit images</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhotos;
