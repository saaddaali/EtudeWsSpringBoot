package com.example.hotelgestion.controller;

import com.example.hotelgestion.entity.Chambre;
import com.example.hotelgestion.entity.Client;
import com.example.hotelgestion.entity.Reservation;
import com.example.hotelgestion.repository.ChambreRepository;
import com.example.hotelgestion.repository.ClientRepository;
import com.example.hotelgestion.repository.ReservationRepository;
import com.example.hotelgestion.service.ReservationService;
import io.prometheus.client.Counter;
import io.prometheus.client.Histogram;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class ReservationControllerGraphQL {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ChambreRepository chambreRepository;
    @Autowired
    private ReservationService reservationService;

    private static final Histogram graphqlLatencyHistogram = Histogram.build()
            .name("graphql_reservation_latency_seconds")
            .help("Latency in seconds for GraphQL reservation requests.")
            .register();

    private static final Counter graphqlRequestCounter = Counter.build()
            .name("graphql_reservation_requests_total")
            .help("Total number of GraphQL reservation requests.")
            .register();

    private static final String LOG_FILE_PATH = "YourPath";

    private void logLatencyToFile(String methodName, double latency) {
        try (FileWriter writer = new FileWriter(LOG_FILE_PATH, true)) {
            writer.write(String.format("Method: %s, Latency: %.4f seconds%n", methodName, latency));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @QueryMapping
    public List<Reservation> allReservations() {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            List<Reservation> reservations = reservationRepository.findAll();
            logLatencyToFile("allReservations", timer.observeDuration());
            return reservations;
        } finally {
            timer.observeDuration();
        }
    }

    @QueryMapping
    public Reservation reservationById(@Argument Long id) {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(String.format("Reservation %s not found", id)));
            logLatencyToFile("reservationById", timer.observeDuration());
            return reservation;
        } finally {
            timer.observeDuration();
        }
    }

    @MutationMapping
    public Reservation saveReservation(
            @Argument LocalDate dateDebut,
            @Argument LocalDate dateFin,
            @Argument Long clientId,
            @Argument Long chambreId,
            @Argument String preferences) {

        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            Chambre chambre = chambreRepository.findById(chambreId)
                    .orElseThrow(() -> new RuntimeException("Chambre not found"));

            Reservation reservation = new Reservation();
            reservation.setDateDebut(dateDebut);
            reservation.setDateFin(dateFin);
            reservation.setPreferences(preferences);
            reservation.setClient(client);
            reservation.setChambre(chambre);

            Reservation savedReservation = reservationRepository.save(reservation);
            logLatencyToFile("saveReservation", timer.observeDuration());
            return savedReservation;
        } finally {
            timer.observeDuration();
        }
    }

    @MutationMapping
    public Reservation updateReservation(@Argument Long id, @Argument Reservation reservation) {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            Reservation existingReservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(String.format("Reservation %s not found", id)));

            Client client = clientRepository.findById(reservation.getClient().getId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            Chambre chambre = chambreRepository.findById(reservation.getChambre().getId())
                    .orElseThrow(() -> new RuntimeException("Chambre not found"));

            existingReservation.setClient(client);
            existingReservation.setChambre(chambre);
            existingReservation.setDateDebut(reservation.getDateDebut());
            existingReservation.setDateFin(reservation.getDateFin());
            existingReservation.setPreferences(reservation.getPreferences());

            Reservation updatedReservation = reservationRepository.save(existingReservation);
            logLatencyToFile("updateReservation", timer.observeDuration());
            return updatedReservation;
        } finally {
            timer.observeDuration();
        }
    }

    @MutationMapping
    public boolean deleteReservation(@Argument Long id) {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            if (!reservationRepository.existsById(id)) {
                throw new RuntimeException(String.format("Reservation %s not found", id));
            }
            reservationRepository.deleteById(id);
            logLatencyToFile("deleteReservation", timer.observeDuration());
            return true;
        } finally {
            timer.observeDuration();
        }
    }

    @QueryMapping
    public Map<String, Object> reservationStats() {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            long count = reservationRepository.count();
            double avgDuration = reservationService.getAverageDuration();
            logLatencyToFile("reservationStats", timer.observeDuration());
            return Map.of("count", count, "avgDuration", avgDuration);
        } finally {
            timer.observeDuration();
        }
    }

    @QueryMapping
    public List<Reservation> reservationsByClientId(@Argument Long clientId) {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            List<Reservation> reservations = reservationRepository.findByClient(client);
            logLatencyToFile("reservationsByClientId", timer.observeDuration());
            return reservations;
        } finally {
            timer.observeDuration();
        }
    }

    @QueryMapping
    public List<Reservation> reservationsByChambreId(@Argument Long chambreId) {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            Chambre chambre = chambreRepository.findById(chambreId)
                    .orElseThrow(() -> new RuntimeException("Chambre not found"));
            List<Reservation> reservations = reservationRepository.findByChambre(chambre);
            logLatencyToFile("reservationsByChambreId", timer.observeDuration());
            return reservations;
        } finally {
            timer.observeDuration();
        }
    }

    @QueryMapping
    public Map<String, Object> reservationState(@Argument Long clientId) {
        graphqlRequestCounter.inc();
        Histogram.Timer timer = graphqlLatencyHistogram.startTimer();
        try {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client not found"));

            long count = reservationRepository.countByClient(client);
            double avgDuration = reservationService.getAverageDurationByClient(client);

            logLatencyToFile("reservationState", timer.observeDuration());
            return Map.of("count", count, "avgDuration", avgDuration);
        } finally {
            timer.observeDuration();
        }
    }
}
