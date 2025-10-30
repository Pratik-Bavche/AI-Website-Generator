"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) CreateNewUser();
  }, [user]); 

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      console.log("User saved:", result.data);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return <>{children}</>;
};

export default Provider;
