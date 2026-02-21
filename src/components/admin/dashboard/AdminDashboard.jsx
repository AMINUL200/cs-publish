import React from "react";
import { useNavigate } from "react-router-dom";
import { dashboardCards } from "./dashboardData";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${card.color} mb-4`}
              >
                <Icon size={24} />
              </div>

              <h2 className="text-lg font-semibold group-hover:text-blue-600">
                {card.title}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;