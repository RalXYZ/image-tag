import { navigate } from "gatsby";
import React, { useState } from "react";
import ReactImageAnnotate from "react-image-annotate";
import config from "../config";

const Annotation = (props) => {
  const [images] = useState(props.location.state.images);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleNext = () => {
    if (selectedImage === images.length - 1) return;
    setSelectedImage(selectedImage + 1);
  };
  const handlePrev = () => {
    if (selectedImage === 0) return;
    setSelectedImage(selectedImage - 1);
  };

  return (
    <ReactImageAnnotate
      labelImages
      hideClone={true}
      selectedImage={selectedImage}
      onNextImage={handleNext}
      onPrevImage={handlePrev}
      regionClsList={["图形区域"]}
      regionTagList={props.location.state.tags}
      onExit={(x) => {
        if (props.location.state.canSubmit) {
          const formData = new FormData();
          formData.append("result", JSON.stringify(x));
          formData.append("assignmentID", props.location.state.assignmentID);
          fetch(`${config.urlHost}/assignment/annotation`, {
            credentials: "include",
            method: "PUT",
            body: formData,
          }).then(() => {
            navigate(-1);
          });
        }
      }}
      images={images}
    />
  );
};

export default Annotation;
