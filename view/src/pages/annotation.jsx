import React, { useState } from "react";
import ReactImageAnnotate from "react-image-annotate";

const Annotation = (props) => {
  const [images, setImages] = useState(props.location.state.images);
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
      onExit={(x) => console.log(x)}
      images={images}
    />
  );
};

export default Annotation;
