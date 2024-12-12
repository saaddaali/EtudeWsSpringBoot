package com.example.hotelgestion.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate dateDebut;
    private LocalDate dateFin;
    @Lob
    private String preferences;
    
    @ManyToOne
    private Client client;
    
    @ManyToOne
    private Chambre chambre;
}