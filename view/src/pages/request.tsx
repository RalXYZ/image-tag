import * as React from "react";
import config from "../config";
import { useState, useEffect } from "react";
import type { GenericListProp } from "../components/genericList";
import GenericList from "../components/genericList";

const Upload: React.FC = () => {
  const [listProps, setListProps] = useState<GenericListProp[]>([]);

  useEffect(() => {
    fetch(`${config.urlHost}/request`, {
      credentials: "include",
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setListProps(data as GenericListProp[]);
      });
    });
  }, []);

  return <GenericList data={listProps} />;
};

export default Upload;
