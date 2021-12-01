import React from "react";
import ReactImageAnnotate from "react-image-annotate";

const Annotation = () => (
  <ReactImageAnnotate
    labelImages
    regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
    regionTagList={["tag1", "tag2", "tag3"]}
    onExit={(x) => console.log(x)}
    images={[
      {
        src: "https://placekitten.com/408/287",
        name: "Image 1",
        regions: []
      }
    ]}
  />
);

export default Annotation;
