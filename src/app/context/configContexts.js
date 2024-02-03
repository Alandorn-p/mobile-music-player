import { defaultIpAddress, defaultPort } from "../misc/constants";
import { createContext } from "react";

export const ipContext = createContext({
  ipAddress: defaultIpAddress,
  setIpAddress: () => {},
  port: defaultPort,
  setPort: () => {},
});
