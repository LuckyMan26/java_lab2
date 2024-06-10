package com.example.demo.dto;

import com.example.demo.models.Product;
import com.example.demo.models.Status;
import com.example.demo.models.User;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

public class OrderDTO {


    @NotNull(message = "User is required")
    public User user;

    @NotNull(message = "products is required")
    public List<Product> products;

    @NotNull(message = "orderDate is required")
    public Date orderDate;

    @NotNull(message = "status is required")
    public Status status;
    @NotNull(message = "totalPrice is required")
    public double totalPrice;
    @NotNull(message = "fullName is required")
    public String fullName;
    @NotNull(message = "address is required")
    public String address;
}
