package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vente")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "n_client", nullable = false)
    private Client client;
    
    @ManyToOne
    @JoinColumn(name = "n_produit", nullable = false)
    private Product product;
    
    @Column(name = "qtesortie", nullable = false)
    private Integer quantity;
    
    public Sale() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}