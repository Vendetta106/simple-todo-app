import React from "react";
import { FaGithub } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className="bg-slate-800 w-auto h-24 flex justify-between">
      <h1 className=" text-4xl text-slate-300 ml-10 mt-6">Todo App</h1>
      <a href="https://github.com/Vendetta106">
        <FaGithub size={44} className="mr-10 mt-6 text-slate-300" />
      </a>
    </div>
  );
};

export default Navbar;
