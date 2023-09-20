import React from "react";
import { Home } from "lucide-react";

function Navbar() {
  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
        <li>
          <a
            href="/"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <Home />
            <span className="ml-3">Homepage</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
