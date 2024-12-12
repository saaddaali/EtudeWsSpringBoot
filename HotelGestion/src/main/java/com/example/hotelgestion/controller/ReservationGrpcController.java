package com.example.hotelgestion.controller;

import com.example.hotelgestion.entity.Reservation;
import com.example.hotelgestion.grpc.*;
import com.example.hotelgestion.service.ReservationService;
import com.example.hotelgestion.repository.ClientRepository;
import com.example.hotelgestion.repository.ChambreRepository;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import io.prometheus.client.Histogram;
import io.prometheus.client.Counter;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@GrpcService
public class ReservationGrpcController extends ReservationServiceGrpc.ReservationServiceImplBase {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ChambreRepository chambreRepository;

    // Prometheus Metrics
    private static final Histogram grpcLatencyHistogram = Histogram.build()
            .name("grpc_reservation_latency_seconds")
            .help("Latency in seconds for gRPC reservation requests.")
            .register();

    private static final Counter grpcRequestCounter = Counter.build()
            .name("grpc_reservation_requests_total")
            .help("Total number of gRPC reservation requests.")
            .labelNames("method")
            .register();

    private static final String LOG_FILE_PATH = "YourPath";

    private void logLatency(String methodName, double duration) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE_PATH, true))) {
            writer.write("Method: " + methodName + ", Latency: " + duration + " seconds\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Get all reservations
    @Override
    public void getAllReservations(Empty request, StreamObserver<ReservationList> responseObserver) {
        grpcRequestCounter.labels("getAllReservations").inc();
        Histogram.Timer timer = grpcLatencyHistogram.startTimer();
        try {
            List<Reservation> reservations = reservationService.obtenirToutesLesReservations();
            ReservationList response = ReservationList.newBuilder()
                    .addAllReservations(reservations.stream()
                            .map(this::mapToReservationResponse)
                            .collect(Collectors.toList()))
                    .build();

            responseObserver.onNext(response);
        } finally {
            double duration = timer.observeDuration();
            logLatency("getAllReservations", duration);
            responseObserver.onCompleted();
        }
    }

    // Get reservation by ID
    @Override
    public void getReservation(ReservationId request, StreamObserver<ReservationResponse> responseObserver) {
        grpcRequestCounter.labels("getReservation").inc();
        Histogram.Timer timer = grpcLatencyHistogram.startTimer();
        try {
            Optional<Reservation> reservation = reservationService.getReservation(request.getId());
            if (reservation.isPresent()) {
                responseObserver.onNext(mapToReservationResponse(reservation.get()));
            } else {
                responseObserver.onError(new RuntimeException("Reservation not found"));
            }
        } finally {
            double duration = timer.observeDuration();
            logLatency("getReservation", duration);
            responseObserver.onCompleted();
        }
    }

    // Create reservation
    @Override
    public void createReservation(CreateReservationRequest request, StreamObserver<ReservationResponse> responseObserver) {
        grpcRequestCounter.labels("createReservation").inc();
        Histogram.Timer timer = grpcLatencyHistogram.startTimer();
        try {
            Reservation reservation = new Reservation();
            reservation.setDateDebut(LocalDate.parse(request.getDateDebut()));
            reservation.setDateFin(LocalDate.parse(request.getDateFin()));
            reservation.setPreferences(request.getPreferences());

            clientRepository.findById(request.getClientId())
                    .ifPresent(reservation::setClient);
            chambreRepository.findById(request.getChambreId())
                    .ifPresent(reservation::setChambre);

            Reservation created = reservationService.createReservation(reservation);
            responseObserver.onNext(mapToReservationResponse(created));
        } catch (Exception e) {
            responseObserver.onError(e);
        } finally {
            double duration = timer.observeDuration();
            logLatency("createReservation", duration);
            responseObserver.onCompleted();
        }
    }

    // Delete reservation
    @Override
    public void deleteReservation(ReservationId request, StreamObserver<DeleteResponse> responseObserver) {
        grpcRequestCounter.labels("deleteReservation").inc();
        Histogram.Timer timer = grpcLatencyHistogram.startTimer();
        try {
            boolean deleted = reservationService.deleteReservation(request.getId());
            DeleteResponse response = DeleteResponse.newBuilder()
                    .setSuccess(deleted)
                    .build();
            responseObserver.onNext(response);
        } finally {
            double duration = timer.observeDuration();
            logLatency("deleteReservation", duration);
            responseObserver.onCompleted();
        }
    }

    // Update reservation
    @Override
    public void updateReservation(ReservationResponse request, StreamObserver<ReservationResponse> responseObserver) {
        grpcRequestCounter.labels("updateReservation").inc();
        Histogram.Timer timer = grpcLatencyHistogram.startTimer();
        try {
            Reservation reservation = new Reservation();
            reservation.setId(request.getId());
            reservation.setDateDebut(LocalDate.parse(request.getDateDebut()));
            reservation.setDateFin(LocalDate.parse(request.getDateFin()));
            reservation.setPreferences(request.getPreferences());

            clientRepository.findById(request.getId())
                    .ifPresent(reservation::setClient);
            chambreRepository.findById(request.getChambre().getId())
                    .ifPresent(reservation::setChambre);

            Reservation updated = reservationService.updateReservation(reservation.getId(),reservation);
            responseObserver.onNext(mapToReservationResponse(updated));
        } catch (Exception e) {
            responseObserver.onError(e);
        } finally {
            double duration = timer.observeDuration();
            logLatency("updateReservation", duration);
            responseObserver.onCompleted();
        }
    }

    // Helper method to map Reservation to ReservationResponse
    private ReservationResponse mapToReservationResponse(Reservation reservation) {
        return ReservationResponse.newBuilder()
                .setId(reservation.getId())
                .setDateDebut(reservation.getDateDebut().toString())
                .setDateFin(reservation.getDateFin().toString())
                .setClient(Client.newBuilder()
                        .setId(reservation.getClient().getId())
                        .setNom(reservation.getClient().getNom())
                        .build())
                .setChambre(Chambre.newBuilder()
                        .setId(reservation.getChambre().getId())
                        .build())
                .setPreferences(reservation.getPreferences())
                .build();
    }


}
