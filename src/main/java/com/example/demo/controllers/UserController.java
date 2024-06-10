package com.example.demo.controllers;

import com.example.demo.dto.BasketDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.models.User;
import com.example.demo.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
@RestController
public class UserController {
    private static final Logger logger = LogManager.getLogger(UserController.class);

    private UserService userService;
    public UserController(UserService userService){
        this.userService = userService;
    }
    @PostMapping(path="/AddUser")
    public ResponseEntity addUser(@RequestBody UserDTO userDTO) {

            userService.addUser(userDTO.getToken(), userDTO.getName(),  userDTO.getEmail());
            return ResponseEntity.ok().build();
    }

    public ResponseEntity<User> getUserById(Long id ) {
            Optional<User> user = userService.getUserById(id);
            if(user.isPresent()) {
                return ResponseEntity.ok(user.get());
            }
            else{
                throw new UserNotFoundException("id: " + id);
            }

    }
    public ResponseEntity<List<User>> getAllClients() {
          List<User> user = userService.getAllUsers();
          return ResponseEntity.ok(user);
    }

    public ResponseEntity deleteClient(Long id ) {

        userService.deleteUser(id);
        return ResponseEntity.ok().build();

    }
}
