import { useState } from "react";
import { reservationService } from "../services/reservationService";

export const useReservation = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    roomType: "SIMPLE",
    startDate: "",
    endDate: "",
    preferences: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getReservations();
      setReservations(data);
      setError(null);
      return data;
    } catch (error) {
      setError("Erreur SOAP lors du chargement");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await reservationService.createReservation(formData);
      await loadReservations();
      setFormData({
        clientName: "",
        email: "",
        phone: "",
        roomType: "SIMPLE",
        startDate: "",
        endDate: "",
        preferences: "",
      });
    } catch (error) {
      setError("Erreur SOAP lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    try {
      setLoading(true);
      await reservationService.deleteReservation(id);
      await loadReservations();
    } catch (error) {
      setError("Erreur SOAP lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (id, updatedData) => {
    try {
      setLoading(true);
      await reservationService.updateReservation(id, updatedData);
      await loadReservations();
    } catch (error) {
      setError("Erreur SOAP lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const getReservationById = async (id) => {
    try {
      setLoading(true);
      const data = await reservationService.getReservationById(id);
      setFormData(data);
      return data;
    } catch (error) {
      setError("Erreur SOAP lors de la récupération");
      return {
        clientName: "",
        email: "",
        phone: "",
        roomType: "SIMPLE",
        startDate: "",
        endDate: "",
        preferences: "",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    loading,
    error,
    reservations,
    loadReservations,
    deleteReservation,
    updateReservation,
    getReservationById,
  };
};
