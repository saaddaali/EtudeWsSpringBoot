package com.example.hotelgestion.service;


import com.example.hotelgestion.entity.Client;
import com.example.hotelgestion.entity.Reservation;
import com.example.hotelgestion.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;


    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    @Transactional
    public Optional<Reservation> getReservation(Long id) {
        return reservationRepository.findById(id);
    }
    @Transactional
    public List<Reservation> obtenirToutesLesReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        if (existingReservation.isPresent()) {
            Reservation reservation = existingReservation.get();
            reservation.setDateDebut(updatedReservation.getDateDebut());
            reservation.setDateFin(updatedReservation.getDateFin());
            reservation.setPreferences(updatedReservation.getPreferences());
            return reservationRepository.save(reservation);
        }
        return null;
    }

    @Transactional
    public boolean deleteReservation(Long id) {
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        if (existingReservation.isPresent()) {
            reservationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Calculate average duration of all reservations
    public double getAverageDuration() {
        List<Reservation> reservations = reservationRepository.findAll();
        double totalDuration = 0;
        for (Reservation reservation : reservations) {
            totalDuration += reservation.getDateFin().toEpochDay() - reservation.getDateDebut().toEpochDay();
        }
        return reservations.isEmpty() ? 0 : totalDuration / reservations.size();
    }

    // Calculate average duration of reservations for a specific client
    public double getAverageDurationByClient(Client client) {
        List<Reservation> reservations = reservationRepository.findByClient(client);
        double totalDuration = 0;
        for (Reservation reservation : reservations) {
            totalDuration += reservation.getDateFin().toEpochDay() - reservation.getDateDebut().toEpochDay();
        }
        return reservations.isEmpty() ? 0 : totalDuration / reservations.size();
    }
}