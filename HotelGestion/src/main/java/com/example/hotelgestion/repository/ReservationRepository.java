package com.example.hotelgestion.repository;

import com.example.hotelgestion.entity.Chambre;
import com.example.hotelgestion.entity.Client;
import com.example.hotelgestion.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByClient(Client client);

    List<Reservation> findByChambre(Chambre chambre);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.client = ?1")
    int countByClient(Client client);
}