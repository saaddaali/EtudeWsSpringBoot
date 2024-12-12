package com.example.hotelgestion.service;

import com.example.hotelgestion.entity.Client;
import com.example.hotelgestion.repository.ClientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;

    @Transactional
    public Client creerClient(Client client) {
        return clientRepository.save(client);
    }

    @Transactional
    public List<Client> obtenirTousLesClients() {
        return clientRepository.findAll();
    }

    @Transactional
    public Client obtenirClientParId(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }

    @Transactional
    public void supprimerClient(Long id) {
        clientRepository.deleteById(id);
    }
}
