package com.example.Backend_Vente.controller;

import com.example.Backend_Vente.model.Client;
import com.example.Backend_Vente.repository.ClientRepository;
import com.example.Backend_Vente.dto.ClientDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {
    
    @Autowired
    private ClientRepository ClientRepository;
    
    @GetMapping
    public List<ClientDTO> getAllClients() {
        return ClientRepository.findAll()
                .stream()
                .map(client -> new ClientDTO(client.getNumclient(), client.getNom(), client.getSalaire()))
                .collect(Collectors.toList());
    }
    
    @PostMapping
    public Client createClient(@RequestBody Client Client) {
        return ClientRepository.save(Client);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client ClientDetails) {
        Client Client = ClientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Client.setNom(ClientDetails.getNom());
        Client.setSalaire(ClientDetails.getSalaire());
        
        Client updatedClient = ClientRepository.save(Client);
        return ResponseEntity.ok(updatedClient);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteClient(@PathVariable Long id) {
        Client Client = ClientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        ClientRepository.delete(Client);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats")
    public Map<String, Double> getSalaryStats() {
        Map<String, Double> stats = new HashMap<>();
        stats.put("total", ClientRepository.getTotalSalary());
        stats.put("min", ClientRepository.getMinSalary());
        stats.put("max", ClientRepository.getMaxSalary());
        return stats;
    }
}