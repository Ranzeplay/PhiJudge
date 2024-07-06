'use client';

import { clearUserAuthStatus } from "@/lib/clientUserUtils";
import { useEffect } from "react";

export function UserDataSweeper() {
  useEffect(() => {
    clearUserAuthStatus();
  }, []);
  return (<></>);
}
