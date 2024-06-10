package com.example.demo.models;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;
import java.io.Serializable;
@Setter
@Getter
@Entity
@Table(name = "products")

public class Product {
    private static final Logger logger = LogManager.getLogger(Product.class);
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private  Long id;
    @Column(name = "name", nullable = false)
    private  String name;
    @Column(name = "description", nullable = false)
    private  String description;
    @Column(name = "price", nullable = false)
    private  double price;
    @Column(name = "quantityAvailable", nullable = false)
    private int quantityAvailable;
    @Column(name = "imageData", nullable = false)
    private String imageData;



    @Override
    public String toString() {
        return "Good{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", quantity_available=" + quantityAvailable +
                '}';
    }
}
