package com.example.demo.dto;

import com.example.demo.models.Product;
import com.example.demo.models.User;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class BasketDTO {


    @NotNull(message = "items is required")
    public List<Product> items;

    @NotNull(message = "user is required")
    public User user;

}
