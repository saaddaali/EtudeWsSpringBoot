import React, { useEffect, useRef } from "react";
import { Calendar, User, Bed, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { useReservation } from "../../hooks/useReservation";

const ReservationList = ({ onEdit, onDelete }) => {
  const mounted = useRef(false);
  const { reservations, loadReservations, deleteReservation, loading, error } =
    useReservation();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      loadReservations().catch((err) => console.error("Erreur SOAP:", err));
    }
  }, [loadReservations]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
      try {
        await deleteReservation(id);
        if (onDelete) onDelete(id);
      } catch (error) {
        console.error("Erreur SOAP lors de la suppression:", error);
      }
    }
  };

  if (loading) return <div className="p-6">Chargement SOAP...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_0.8fr_2fr] gap-4 mb-2 px-4 text-base font-medium text-gray-600">
          <div>Client</div>
          <div>Contact</div>
          <div>Chambre</div>
          <div>Dates</div>
          <div>ID</div>
          <div className="text-center">Actions</div>
        </div>

        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-100 transition-all"
          >
            <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_0.8fr_2fr] gap-4 items-center text-base font-medium">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{reservation.clientName}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {reservation.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {reservation.phone}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{reservation.roomType}</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <div>{reservation.startDate}</div>
                    <div>{reservation.endDate}</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="text-gray-600">#{reservation.id}</span>
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onEdit(reservation.id)}
                  className="px-3 py-1.5 text-base font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="px-3 py-1.5 text-base font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
