import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import user from "../../assets/avatar/add-photos.png";
import { BASE_URL } from "../../base";
import {
  getUserProfileAsync,
  uploadProfilePictureAsync,
} from "../../dating/store/slice/profileSlice";

const AddPhotos = () => {
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState([
    { url: user, file: null },
    { url: user, file: null },
    { url: user, file: null },
    { url: user, file: null },
  ]);

  useEffect(() => {
    // Fetch user profile data when the component mounts
    dispatch(getUserProfileAsync());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleImageClick = async (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        const newImages = [...selectedImages];
        newImages[index] = { url: URL.createObjectURL(file) };
        setSelectedImages(newImages);
      }
    });

    fileInput.click();
  };

  const submitImages = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.data?._id;

    if (!userId) {
      toast.error("User ID not found!");
      return;
    }

    // Filter out only the actual files (not default avatars)
    const filesToUpload = selectedImages
      .map((img) => img.file)
      .filter((file) => file);

    if (filesToUpload.length < 1) {
      toast.error("Please select at least 1 image.");
      return;
    }

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("image", file); // Use 'image' as the field name
    });
    formData.append("userId", userId); // Also append userId as in the API usage

    try {
      // Log the URL for debugging
      console.log(`Uploading to: ${BASE_URL}/User/uploadProfile/${userId}`);
      const response = await fetch(`${BASE_URL}/User/uploadProfile/${userId}`, {
        method: "PUT", // Changed back to PUT
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      toast.success("Images uploaded successfully!");
      console.log("data: ", data);
      navigate("/");
    } catch (error) {
      toast.error("Image upload failed!");
      console.error("Upload error:", error);
    }
  };

  const title = "Add Images";
  const desc =
    "Make your dating profile stand out! Add images to showcase your personality and interests. Let others see the real you—upload your best photos now!";
  const btnText = "See More Popular";

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
                      src={image.url}
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
