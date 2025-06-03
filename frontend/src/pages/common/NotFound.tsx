import { Link } from "react-router-dom";

// src/pages/NotFound.tsx
const NotFound = () => {
  return (
    <div className="text-center mt-20 min-h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-500">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="p-10 text-black fill-orange-500 my-10">Return to Home</Link>
    </div>
  );
};

export default NotFound;