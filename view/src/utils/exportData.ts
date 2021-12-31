import X2JS from "x2js";
import JSZip from "jszip";
import FileSaver from "file-saver";

export type project = {
  name: string;
  regionClsList: string[]; // from annotation json
  regionTagList: string[]; // from annotation json
  images: {
    id: string; // uuid
    uploadTime: string;
  }[];
  annotations: {
    key: number;
    src: string;
    name: string; // uuid
    regions: {
      type: string;
      open?: boolean;
      x?: number;
      y?: number;
      w?: number;
      h?: number;
      x1?: number;
      x2?: number;
      y1?: number;
      y2?: number;
      points?: number[][]; // polygon
      highlighted: boolean;
      color: string;
      cls: string;
      id: string;
      editingLabels: boolean;
      tags: string[];
    }[];
    pixelSize: {
      w?: number;
      h?: number;
    };
  }[];
};

export function exportCOCO(currentProject: project) {
  let date = new Date();

  let info = {
    description: currentProject.name,
    url: "https://ralxyz.xyz",
    version: "1.0",
    year: 2021,
    contributor: "RalXYZ",
    date_created: `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`,
  };
  let licenses = [
    {
      url: "http://creativecommons.org/licenses/by-nc-sa/2.0/",
      id: 1,
      name: "Attribution-NonCommercial-ShareAlike License",
    },
  ];

  let images = currentProject.images.map((r) => {
    let ret: any = {
      lincese: 1,
      file_name: r.id,
      id: r.id,
      date_captured: r.uploadTime,
    };
    let annotation = currentProject.annotations.filter(
      (o) => o.name === r.id
    )[0];
    let pixelSize = annotation.pixelSize;
    ret.height = pixelSize.h;
    ret.width = pixelSize.w;
    ret.coco_url = annotation.src;
    ret.flickr_url = annotation.src;
    return ret;
  });
  let categories = currentProject.regionTagList.map((r, i) => {
    return {
      id: i,
      name: r,
      supercategory: currentProject.regionClsList[0],
    };
  });
  let annotations = [];
  currentProject.annotations.forEach((r) => {
    let pixelSize = r.pixelSize;
    let regions = r.regions;
    regions.forEach((e) => {
      let beginX = 0,
        beginY = 0,
        width = 0,
        height = 0;
      let segmentation = [];
      let area = 0;
      let annotationId = e.id;
      switch (e.type) {
        case "box":
          beginX = pixelSize.w * e.x;
          beginY = pixelSize.h * e.y;
          width = pixelSize.w * e.w;
          height = pixelSize.h * e.h;
          area = width * height;
          break;
        case "point":
          beginX = pixelSize.w * e.x;
          beginY = pixelSize.h * e.y;
          width = height = 1;
          area = 1;
          break;
        case "polygon":
          segmentation = e.points;
          break;
        case "line":
          beginX = pixelSize.w * e.x1;
          beginY = pixelSize.h * e.y1;
          width = pixelSize.w * e.x2;
          height = pixelSize.h * e.y2;
          area = 1;
        default:
          break;
      }

      annotations.push({
        iscrowd: 0,
        image_id: r.regions[0].id,
        category_id: currentProject.regionClsList,
        id: annotationId,
        area,
        segmentation,
        bbox: [beginX, beginY, width, height],
      });
    });
  });
  let ans = { info, licenses, images, annotations, categories };
  let jsr = JSON.stringify(ans);
  let blob = new Blob([jsr], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = `COCO-object-${
    currentProject.name
  }-${date.getFullYear()}${date.getMonth()}${date.getDay()}`;
  document.documentElement.appendChild(a);
  a.click();
  document.documentElement.removeChild(a);
}

export function exportVOC(currentProject: project) {
  let date = new Date();

  let zip = new JSZip();
  let x2js = new X2JS();

  currentProject.images.forEach((r) => {
    let an = currentProject.annotations.filter((o) => o.name === r.id)[0];
    let pixelSize = an.pixelSize;
    let regions = an.regions;
    let annotation = {
      folder: currentProject.name,
      filename: r.id,
      size: { width: pixelSize.w, height: pixelSize.h, depth: 3 },
      segmented: 0,
      object: [],
    };
    regions.forEach((e) => {
      let tmp = { name: e.cls, truncated: 0, difficult: 0 };
      let beginX = 0,
        beginY = 0,
        width = 0,
        height = 0;
      let segmentation = [];
      let area = 0;
      let name = "";
      switch (e.type) {
        case "box":
          name = "bndbox";
          beginX = pixelSize.w * e.x;
          beginY = pixelSize.h * e.y;
          width = pixelSize.w * e.w;
          height = pixelSize.h * e.h;
          area = width * height;
          break;
        case "point":
          name = "point";
          beginX = pixelSize.w * e.x;
          beginY = pixelSize.h * e.y;
          width = height = 1;
          area = 1;
          break;
        case "polygon":
          name = "polygon";
          segmentation = e.points;
          break;
        case "line":
          name = "line";
          beginX = pixelSize.w * e.x1;
          beginY = pixelSize.h * e.y1;
          width = pixelSize.w * e.x2;
          height = pixelSize.h * e.y2;
          area = 1;
        default:
          break;
      }
      tmp[name] = {
        xmin: beginX,
        xmax: beginX + width,
        ymin: beginY,
        ymax: beginY + height,
        area: area,
        segmentation: segmentation,
      };
      annotation.object.push(tmp);
    });
    let xmlAsStr = x2js.js2xml({ annotation: annotation });
    let blob = new Blob([xmlAsStr], { type: "application/xml" });
    zip.file(r.id + ".xml", blob);
  });
  zip.generateAsync({ type: "blob" }).then((content) => {
    FileSaver(
      content,
      `VOC-object-${
        currentProject.name
      }-${date.getFullYear()}${date.getMonth()}${date.getDay()}`
    );
  });
}
