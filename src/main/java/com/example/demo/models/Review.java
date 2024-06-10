package com.example.demo.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;
import java.io.Serializable;
@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private  Long id;
    @OneToOne
    private  User user;
    @Column(name = "text", nullable = false)
    private  String text;
    @OneToOne
    private  Product product;
    @Column(name = "stars", nullable = false)
    private  int stars;

    public Product getGoodId(){
        return product;
    }


    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", client_id='" + user.toString() + '\'' +
                ", text='" + text + '\'' +
                ", User='" + user .toString()+ '\'' +
                '}';
    }
}
