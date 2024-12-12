package com.example.hotelgestion.controller;

import com.example.hotelgestion.entity.Chambre;
import com.example.hotelgestion.entity.Client;
import com.example.hotelgestion.entity.Reservation;
import com.example.hotelgestion.service.ReservationService;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import io.prometheus.client.Histogram;
import io.prometheus.client.Counter;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
@CrossOrigin(origins = "http://localhost:3001")
@WebService(serviceName = "ReservationWs")
public class ReservationSoapController {

    private static final Logger LOGGER = Logger.getLogger(ReservationSoapController.class.getName());

    @Autowired
    private ReservationService reservationService;

    // Prometheus Metrics
    private static final Histogram soapLatencyHistogram;

    private static final Counter soapRequestCounter;

    private static final String LOG_FILE_PATH = "YourPath";


    // Method for logging latency to a file
    private void logLatency(String methodName, double duration) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE_PATH , true))) {
            writer.write("Method: " + methodName + ", Latency: " + duration + " seconds\n");
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error writing latency to file", e);
        }
    }

    static {
        soapLatencyHistogram = Histogram.build()
                .name("soap_reservation_latency_seconds")
                .help("Latency in seconds for SOAP reservation requests.")
                .buckets(0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0)
                .register();
        soapRequestCounter = Counter.build()
                .name("soap_reservation_requests_total")
                .help("Total number of SOAP reservation requests.")
                .register();
    }

    // Get all reservations
    @WebMethod
    public List<Reservation> getAllReservations() {
        soapRequestCounter.inc();  // Increment request counter
        Histogram.Timer timer = soapLatencyHistogram.startTimer();
        try {
            LOGGER.info("Fetching all reservations.");
            List<Reservation> reservations = reservationService.obtenirToutesLesReservations();
            logLatency("getAllReservations", timer.observeDuration());
            return reservations;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error fetching all reservations", e);
            throw new RuntimeException("Error fetching all reservations", e);
        }
    }

    // Get reservation by ID
    @WebMethod
    public Reservation getReservationById(@WebParam(name = "id") Long id) {
        soapRequestCounter.inc();
        Histogram.Timer timer = soapLatencyHistogram.startTimer();
        try {
            Optional<Reservation> reservation = reservationService.getReservation(id);
            logLatency("getReservationById", timer.observeDuration());
            return reservation.orElse(null);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error fetching reservation by ID", e);
            throw new RuntimeException("Error fetching reservation by ID", e);
        }
    }

    // Create a reservation
    @WebMethod(operationName = "createReservation")
    public Reservation createReservation(@WebParam(name = "dateDebut") LocalDate dateDebut,
                                         @WebParam(name = "dateFin") LocalDate dateFin,
                                         @WebParam(name = "client") Client client,
                                         @WebParam(name = "chambre") Chambre chambre,
                                         @WebParam(name = "preference") String preference) {
        soapRequestCounter.inc();
        Histogram.Timer timer = soapLatencyHistogram.startTimer();
        try {
            Reservation reservation = new Reservation();
            reservation.setDateDebut(dateDebut);
            reservation.setDateFin(dateFin);
            reservation.setClient(client);
            reservation.setChambre(chambre);
            reservation.setPreferences(preference);
            Reservation createdReservation = reservationService.createReservation(reservation);
            logLatency("createReservation", timer.observeDuration());
            return createdReservation;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error creating reservation", e);
            throw new RuntimeException("Error creating reservation", e);
        }
    }

    // Delete a reservation
    @WebMethod
    public boolean deleteReservation(@WebParam(name = "id") Long id) {
        soapRequestCounter.inc();
        Histogram.Timer timer = soapLatencyHistogram.startTimer();
        try {
            Optional<Reservation> reservation = reservationService.getReservation(id);
            if (reservation.isPresent()) {
                reservationService.deleteReservation(id);
                logLatency("deleteReservation", timer.observeDuration());
                return true;
            }
            logLatency("deleteReservation", timer.observeDuration());
            return false;  // Return false if reservation is not found
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error deleting reservation", e);
            throw new RuntimeException("Error deleting reservation", e);
        }
    }

    // Update a reservation
    @WebMethod
    public Reservation updateReservation(@WebParam(name = "id") Long id, @WebParam(name = "reservation") Reservation reservation) {
        soapRequestCounter.inc();
        Histogram.Timer timer = soapLatencyHistogram.startTimer();
        try {
            Reservation existingReservation = reservationService.getReservation(id).orElseThrow(() -> new RuntimeException(String.format("Reservation %s not found", id)));
            existingReservation.setClient(reservation.getClient());
            existingReservation.setChambre(reservation.getChambre());
            existingReservation.setDateDebut(reservation.getDateDebut());
            existingReservation.setDateFin(reservation.getDateFin());
            existingReservation.setPreferences(reservation.getPreferences());
            Reservation updatedReservation = reservationService.createReservation(existingReservation);
            logLatency("updateReservation", timer.observeDuration());
            return updatedReservation;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error updating reservation", e);
            throw new RuntimeException("Error updating reservation", e);
        }
    }


}
