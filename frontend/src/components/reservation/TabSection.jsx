import React from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

const TabSection = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "create", icon: <Plus className="h-4 w-4" />, label: "Nouvelle" },
    { id: "view", icon: <Search className="h-4 w-4" />, label: "Consulter" },
    { id: "edit", icon: <Edit className="h-4 w-4" />, label: "Modifier" },
    { id: "delete", icon: <Trash2 className="h-4 w-4" />, label: "Supprimer" },
  ];

  return (
    <div className="flex space-x-4 mb-8">
      {tabs.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
            activeTab === id
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:shadow-md"
          }`}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSection;
