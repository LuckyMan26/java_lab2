package com.example.demo.dto;

import com.example.demo.models.Product;
import com.example.demo.models.User;
import jakarta.validation.constraints.NotNull;

public class ProductDTO {


    @NotNull(message = "name is required")
    public String name;

    @NotNull(message = "price is required")
    public int price;

    @NotNull(message = "desciption is required")
    public String description;

    @NotNull(message = "imageData is required")
    public String  imageData;

}
