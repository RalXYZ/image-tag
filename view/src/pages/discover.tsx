import * as React from "react";
import config from "../config";
import { useState, useEffect } from "react";
import type { GenericListProp } from "../components/genericList";
import GenericList from "../components/genericList";

const Discover: React.FC = () => {
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

  return (
    <GenericList
      data={listProps}
      skeleton={{
        buttonName: "Claim",
        buttonCallback: (id: string) => {
          fetch(`${config.urlHost}/assignment/request/${id}`, {
            credentials: "include",
            method: "POST",
          }).then((res) => {
            res.json().then((data) => {
              setListProps(data as GenericListProp[]);
            });
          });
        },
      }}
    />
  );
};

export default Discover;
