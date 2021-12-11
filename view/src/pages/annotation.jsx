import React from "react";
import ReactImageAnnotate from "react-image-annotate";

const Annotation = (props) => (
  <ReactImageAnnotate
    labelImages
    regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
    regionTagList={["tag1", "tag2", "tag3"]}
    onExit={(x) => console.log(x)}
    images={props.location.state.images}
  />
);

export default Annotation;
