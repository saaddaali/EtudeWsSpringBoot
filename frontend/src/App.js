// src/App.js
import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "./components/ui/card/card";
import Navigation from "./components/layout/Navigation";
import ReservationForm from "./components/reservation/ReservationForm";
import ReservationList from "./components/reservation/ReservationList";
import EditReservation from "./components/reservation/EditReservation";
import DeleteReservation from "./components/reservation/DeleteReservation";
import { Plus, Search, Edit, Trash2, Clock } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  const handleEdit = (reservationId) => {
    setSelectedReservationId(reservationId);
    setActiveTab("edit");
  };

  const handleDelete = (reservationId) => {
    setSelectedReservationId(reservationId);
    setActiveTab("delete");
  };

  const tabs = [
    {
      id: "create",
      icon: <Plus className="h-4 w-4" />,
      label: "Nouvelle",
    },
    {
      id: "view",
      icon: <Search className="h-4 w-4" />,
      label: "Consulter",
    },
    {
      id: "edit",
      icon: <Edit className="h-4 w-4" />,
      label: "Modifier",
    },
    {
      id: "delete",
      icon: <Trash2 className="h-4 w-4" />,
      label: "Supprimer",
    },
  ];

  const renderTabs = () => {
    return (
      <div className="flex space-x-4 mb-8 px-6">
        {tabs.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              if (id !== "edit" && id !== "delete") {
                setSelectedReservationId(null);
              }
            }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all transform hover:scale-105 text-lg font-medium ${
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

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <ReservationForm />;
      case "view":
        return <ReservationList onEdit={handleEdit} onDelete={handleDelete} />;
      case "edit":
        return selectedReservationId ? (
          <EditReservation reservationId={selectedReservationId} />
        ) : (
          <div className="p-6 text-center text-gray-500 text-lg font-medium">
            Veuillez sélectionner une réservation à modifier dans l'onglet
            "Consulter"
          </div>
        );
      case "delete":
        return selectedReservationId ? (
          <DeleteReservation reservationId={selectedReservationId} />
        ) : (
          <div className="p-6 text-center text-gray-500 text-lg font-medium">
            Veuillez sélectionner une réservation à supprimer dans l'onglet
            "Consulter"
          </div>
        );
      default:
        return <ReservationForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-0.5 px-4">
        <Card className="w-full bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Système de Réservation
                </CardTitle>
                <p className="text-gray-500 mt-1 text-lg font-medium">
                  Gérez vos réservations d'hôtel en toute simplicité
                </p>
              </div>
              <div className="flex items-center text-gray-500 text-lg font-medium">
                <Clock className="h-5 w-5 mr-2" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardHeader>

          {renderTabs()}

          <div className="transition-all duration-300 ease-in-out">
            {renderContent()}
          </div>
        </Card>
      </main>

      <footer className="py-4 text-center text-gray-600 text-base font-medium">
        <p>&copy; 2024 Système de Réservation d'Hôtel. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
