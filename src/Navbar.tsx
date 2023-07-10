import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-2 mt-0 w-full">
      <div className="container mx-auto flex items-center">
        <div className="flex text-white font-extrabold">
          <a href="#" className="mr-4">
            Home
          </a>
          <a href="#">Transcripts</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
