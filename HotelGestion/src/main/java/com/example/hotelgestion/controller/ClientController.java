package com.example.hotelgestion.controller;

import com.example.hotelgestion.entity.Client;
import com.example.hotelgestion.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @PostMapping
    public ResponseEntity<Client> creerClient(@RequestBody Client client) {
        return ResponseEntity.ok(clientService.creerClient(client));
    }

    @GetMapping
    public ResponseEntity<List<Client>> obtenirTousLesClients() {
        return ResponseEntity.ok(clientService.obtenirTousLesClients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> obtenirClientParId(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.obtenirClientParId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerClient(@PathVariable Long id) {
        clientService.supprimerClient(id);
        return ResponseEntity.noContent().build();
    }
}
