"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/userDetailContext";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>(null);
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!user || hasAttempted.current) return;
    hasAttempted.current = true;
    createOrFetchUser();
  }, [user]);

  const createOrFetchUser = async () => {
    try {
      const { data } = await axios.post("/api/users");
      console.log("✅ User info:", data.user);
      setUserDetail(data.user);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        console.warn("⚠️ Not signed in; skipping user creation");
      } else {
        console.error("❌ Error saving user:", error?.response?.data || error.message);
      }
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export default Provider;
