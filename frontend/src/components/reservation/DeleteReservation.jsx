import React, { useState, useEffect } from "react";
import { AlertTriangle, User, Mail, Phone, Bed, Calendar } from "lucide-react";
import { useReservation } from "../../hooks/useReservation";
import { reservationService } from "../../services/reservationService";

const DeleteReservation = ({ reservationId }) => {
  const { deleteReservation, loading, error } = useReservation();
  const [reservation, setReservation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        if (reservationId) {
          const data = await reservationService.getReservationById(
            reservationId
          );
          setReservation(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la réservation:", error);
      }
    };

    fetchReservationData();
  }, [reservationId]);

  const handleDelete = async () => {
    try {
      await deleteReservation(reservationId);
      setShowConfirmation(false);
      // Ici vous pouvez ajouter une redirection ou notification de succès
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center text-base font-medium text-red-500">
        Erreur: {error}
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-6 text-center text-base font-medium text-gray-500">
        Chargement des détails de la réservation...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="text-lg font-medium text-gray-700 mb-4">
          Suppression de la réservation #{reservationId}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-base font-medium">
            {/* client infos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Client:</span>
                <span>{reservation.clientName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span>{reservation.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Téléphone:</span>
                <span>{reservation.phone}</span>
              </div>
            </div>

            {/* reservation infos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Type de chambre:</span>
                <span>{reservation.roomType}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Période:</span>
                <span>
                  {reservation.startDate} - {reservation.endDate}
                </span>
              </div>
            </div>
          </div>

          {!showConfirmation ? (
            <button
              onClick={() => setShowConfirmation(true)}
              disabled={loading}
              className="w-full mt-6 bg-red-500 text-white py-3 px-6 rounded-xl text-base font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Supprimer cette réservation</span>
            </button>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-center text-red-700 text-base font-medium">
                  Êtes-vous sûr de vouloir supprimer cette réservation ? Cette
                  action est irréversible.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl text-base font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Suppression..." : "Confirmer la suppression"}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl text-base font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteReservation;
