"use client";

import Login from "@/app/dashboard/_components/Login";

export default function LoginPage() {
  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center bg-shade-07/70">
      <div className="w-full max-w-120 m-auto p-16 bg-b-surface2 shadow-depth rounded-3xl transition duration-300 ease-out">
        <Login />
      </div>
    </div>
  );
}
