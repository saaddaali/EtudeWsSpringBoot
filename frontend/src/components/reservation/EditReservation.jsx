// EditReservation.jsx
import React, { useEffect } from "react";
import { User, Mail, Phone, Bed, Calendar, Clock, Heart } from "lucide-react";
import { useReservation } from "../../hooks/useReservation";
import { reservationService } from "../../services/reservationService";

const EditReservation = ({ reservationId }) => {
  const {
    formData,
    handleInputChange,
    updateReservation,
    setFormData,
    loading,
    error,
  } = useReservation();

  const safeFormData = {
    clientName: formData?.clientName ?? "",
    email: formData?.email ?? "",
    phone: formData?.phone ?? "",
    roomType: formData?.roomType ?? "simple",
    startDate: formData?.startDate ?? "",
    endDate: formData?.endDate ?? "",
    preferences: formData?.preferences ?? "",
  };

  useEffect(() => {
    const fetchReservationData = async () => {
      if (!reservationId) return;

      try {
        const data = await reservationService.getReservationById(reservationId);
        const safeData = {
          clientName: data?.clientName ?? "",
          email: data?.email ?? "",
          phone: data?.phone ?? "",
          roomType: data?.roomType ?? "simple",
          startDate: data?.startDate ?? "",
          endDate: data?.endDate ?? "",
          preferences: data?.preferences ?? "",
        };
        setFormData(safeData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchReservationData();
  }, [reservationId, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReservation(reservationId, safeFormData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (error) return <div className="p-6 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center space-x-2 text-lg font-medium text-gray-700">
        <span>Modification de la réservation</span>
        <span className="text-purple-600">#{reservationId}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* client name */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <User className="h-5 w-5 text-purple-500" />
              <span>Nom du Client</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={safeFormData.clientName}
              onChange={handleInputChange}
              className="w-full p-3 text-base font-medium border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* email */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Mail className="h-5 w-5 text-purple-500" />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={safeFormData.email}
              onChange={handleInputChange}
              className="w-full p-3 text-base font-medium border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* phone number */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Phone className="h-5 w-5 text-purple-500" />
              <span>Téléphone</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={safeFormData.phone}
              onChange={handleInputChange}
              className="w-full p-3 text-base font-medium border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* room type */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Bed className="h-5 w-5 text-purple-500" />
              <span>Type de Chambre</span>
            </label>
            <select
              name="roomType"
              value={safeFormData.roomType}
              onChange={handleInputChange}
              className="w-full p-3 text-base font-medium border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            >
              <option value="SIMPLE">Simple</option>
              <option value="DOUBLE">Double</option>
              <option value="TRIPLE">Triple</option>
              <option value="SUITE">Suite Luxe</option>
            </select>
          </div>

          {/* check in date */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span>Date d'arrivée</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={safeFormData.startDate}
              onChange={handleInputChange}
              className="w-full p-3 text-base font-medium border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* check out date */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Clock className="h-5 w-5 text-purple-500" />
              <span>Date de départ</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={safeFormData.endDate}
              onChange={handleInputChange}
              className="w-full p-3 text-base font-medium border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* prefs */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
            <Heart className="h-5 w-5 text-purple-500" />
            <span>Préférences</span>
          </label>
          <textarea
            name="preferences"
            value={safeFormData.preferences}
            onChange={handleInputChange}
            className="w-full p-3 text-base font-medium border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Mise à jour en cours..." : "Mettre à jour la Réservation"}
        </button>
      </form>
    </div>
  );
};

export default EditReservation;