import React from "react";
import { UserProvider } from "./src/context/UserContext";
export const wrapRootElement = ({ element }) => (
  <UserProvider>{element}</UserProvider>
);
