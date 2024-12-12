package com.example.hotelgestion.controller;

import com.example.hotelgestion.entity.Reservation;
import com.example.hotelgestion.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.prometheus.client.Histogram;
import io.prometheus.client.Counter;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationRestController {

    @Autowired
    private ReservationService reservationService;

    // Prometheus Metrics
    private static final Histogram restLatencyHistogram = Histogram.build()
            .name("rest_reservation_latency_seconds")
            .help("Latency in seconds for REST reservation requests.")
            .register();

    private static final Counter restRequestCounter = Counter.build()
            .name("rest_reservation_requests_total")
            .help("Total number of REST reservation requests.")
            .register();

    private static final String LOG_FILE_PATH = "YourPath";

    private void logLatency(String methodName, double duration) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE_PATH, true))) {
            writer.write("Method: " + methodName + ", Latency: " + duration + " seconds\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Create a reservation
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        restRequestCounter.inc();  // Increment the counter for requests
        Histogram.Timer timer = restLatencyHistogram.startTimer();  // Start the timer for latency tracking
        try {
            Reservation createdReservation = reservationService.createReservation(reservation);
            return new ResponseEntity<>(createdReservation, HttpStatus.CREATED);
        } finally {
            double duration = timer.observeDuration();  // Log the duration of the request
            logLatency("createReservation", duration);  // Log latency to file
        }
    }

    // Get a reservation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservation(@PathVariable Long id) {
        restRequestCounter.inc();  // Increment the counter for requests
        Histogram.Timer timer = restLatencyHistogram.startTimer();  // Start the timer for latency tracking
        try {
            Optional<Reservation> reservation = reservationService.getReservation(id);
            return reservation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } finally {
            double duration = timer.observeDuration();  // Log the duration of the request
            logLatency("getReservation", duration);  // Log latency to file
        }
    }

    // Update a reservation
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation updatedReservation) {
        restRequestCounter.inc();  // Increment the counter for requests
        Histogram.Timer timer = restLatencyHistogram.startTimer();  // Start the timer for latency tracking
        try {
            Reservation reservation = reservationService.updateReservation(id, updatedReservation);
            return reservation != null ? ResponseEntity.ok(reservation) : ResponseEntity.notFound().build();
        } finally {
            double duration = timer.observeDuration();  // Log the duration of the request
            logLatency("updateReservation", duration);  // Log latency to file
        }
    }

    // Delete a reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        restRequestCounter.inc();  // Increment the counter for requests
        Histogram.Timer timer = restLatencyHistogram.startTimer();  // Start the timer for latency tracking
        try {
            boolean isDeleted = reservationService.deleteReservation(id);
            return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } finally {
            double duration = timer.observeDuration();  // Log the duration of the request
            logLatency("deleteReservation", duration);  // Log latency to file
        }
    }

    // Get all reservations
    @GetMapping
    public ResponseEntity<List<Reservation>> obtenirToutesLesReservations() {
        restRequestCounter.inc();  // Increment the counter for requests
        Histogram.Timer timer = restLatencyHistogram.startTimer();  // Start the timer for latency tracking
        try {
            return ResponseEntity.ok(reservationService.obtenirToutesLesReservations());
        } finally {
            double duration = timer.observeDuration();  // Log the duration of the request
            logLatency("obtenirToutesLesReservations", duration);  // Log latency to file
        }
    }


}
