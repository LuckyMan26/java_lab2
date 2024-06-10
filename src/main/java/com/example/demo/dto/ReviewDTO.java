package com.example.demo.dto;



import com.example.demo.models.Product;
import com.example.demo.models.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
public class ReviewDTO {


    @NotNull(message = "User is required")
    public Long user_id;

    @NotNull(message = "Product id is required")
    public Long productId;

    @NotNull(message = "Text is required")
    public String text;

    @NotNull(message = "Number of stars is required")
    public int stars;


}
