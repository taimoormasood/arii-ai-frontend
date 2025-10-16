"use client";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto mt-10">
      <ShieldAlert size={56} className="text-red-600 mb-4" />
      <h2 className="text-red-600 text-2xl font-semibold mb-2">
        Access Denied
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        You don&apos;t have permission to view this page.
      </p>
      <button
        onClick={() => router.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 text-base font-medium transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
