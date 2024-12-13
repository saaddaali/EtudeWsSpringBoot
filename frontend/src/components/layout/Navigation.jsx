import React from "react";
import { Bell, Home, User, Settings } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="px-4 py-2 mb-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                LachgarHotel
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-500 hover:text-purple-600 transition-colors cursor-pointer" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  1
                </span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <Settings className="h-6 w-6 text-gray-500 hover:text-purple-600 transition-colors cursor-pointer" />
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
