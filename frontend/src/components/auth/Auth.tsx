import React from "react";

export const Auth: React.FC = () => {
  // redirect to login page
  location.href = "http://localhost:3001/auth";

  return <div>redirecting...</div>;
};
