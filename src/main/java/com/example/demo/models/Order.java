package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.NoArgsConstructor;
import com.example.demo.controllers.ProductController;

import java.util.ArrayList;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;

import java.util.List;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "orders")

public class Order {
    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    private  Long id;
    @OneToOne
    private  User user;
    @Column(name = "product_items_id")
    @OneToMany(mappedBy = "id", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Product> products;
    @Column(name = "order_date")
    private  Date orderDate;
    @Column(name = "status")
    private  String status;
    @Column(name = "totalPrice")
    private  double totalPrice;
    @Column(name = "fullName")
    private  String fullName;
    @Column(name = "address")
    private  String address;



    @Override
    public String toString() {
        return "Order{" +
                "order_id=" + id +
                ", user='" + user.toString() + '\'' +
                ", order_date='" + orderDate + '\'' +

                ", status=" + status +
                '}';
    }
}
