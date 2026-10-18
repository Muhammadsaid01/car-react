import "react-router-dom";
import "react-router";
import { ReactNode } from "react";

// React Router v5 predates React 18's explicit children props.
declare module "react-router-dom" {
  interface BrowserRouterProps { children?: ReactNode; }
}
declare module "react-router" {
  interface MemoryRouterProps { children?: ReactNode; }
}
