package com.example.demo.dto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

@Setter
@Getter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
    @NotNull(message = "token is required")
    private String token;
    @NotNull(message = "name is required")
    private String name;
    @NotNull(message = "email is required")
    private  String email;


}
