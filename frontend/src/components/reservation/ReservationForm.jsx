import React, { useState } from "react";
import { User, Mail, Phone, Bed, Calendar, Clock, Heart } from "lucide-react";
import { useReservation } from "../../hooks/useReservation";

const ReservationForm = ({ onCancel }) => {
  const { formData, handleInputChange, handleSubmit, loading, error } =
    useReservation();
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitError(null);
      await handleSubmit(e);
      if (onCancel) onCancel();
    } catch (error) {
      setSubmitError("Erreur SOAP lors de la création de la réservation");
      console.error("Erreur SOAP:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Nouvelle Réservation
        </h2>
        <p className="text-gray-600">
          Remplissez les informations pour créer une nouvelle réservation
        </p>
      </div>

      {(error || submitError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error || submitError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <User className="h-5 w-5 text-purple-500" />
              <span>Nom du Client</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="Prénom Nom"
              className="w-full p-3 font-medium text-base border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Mail className="h-5 w-5 text-purple-500" />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className="w-full p-3 font-medium text-base border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Phone className="h-5 w-5 text-purple-500" />
              <span>Téléphone</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="06 12 34 56 78"
              className="w-full p-3 font-medium text-base border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Bed className="h-5 w-5 text-purple-500" />
              <span>Type de Chambre</span>
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="w-full p-3 font-medium text-base border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            >
              <option value="SIMPLE">Simple</option>
              <option value="DOUBLE">Double</option>
              <option value="TRIPLE">Triple</option>
              <option value="SUITE">Suite Luxe</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span>Date d'arrivée</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full p-3 font-medium text-base border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              //required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
              <Clock className="h-5 w-5 text-purple-500" />
              <span>Date de départ</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full p-3 font-medium text-base border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              //required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-base font-medium text-gray-700">
            <Heart className="h-5 w-5 text-purple-500" />
            <span>Préférences</span>
          </label>
          <textarea
            name="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
            placeholder="Précisez vos demandes particulières..."
            className="w-full p-3 font-medium text-base border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            rows="3"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 bg-gray-500 text-white py-4 px-6 rounded-xl text-lg font-medium hover:bg-gray-600 transition-all duration-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Communication SOAP..." : "Créer la Réservation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
