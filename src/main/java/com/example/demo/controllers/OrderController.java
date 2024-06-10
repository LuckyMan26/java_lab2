package com.example.demo.controllers;

import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.exception.OrderNotFoundException;
import com.example.demo.models.Order;
import com.example.demo.models.Status;
import com.example.demo.service.BasketService;
import com.example.demo.service.OrderService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.weaver.ast.Or;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.List;
import java.util.Optional;
@Controller
public class OrderController {
    private static final Logger logger = LogManager.getLogger(OrderController.class);
    private final OrderService orderService;
    public OrderController(OrderService orderService){
       this.orderService = orderService;
    }
    @GetMapping("/MakeOrder")
    public ResponseEntity addOrder(@Validated @RequestBody OrderDTO orderDTO) {
           orderService.addOrder(orderDTO.user,orderDTO.products,orderDTO.orderDate,orderDTO.status, orderDTO.totalPrice, orderDTO.fullName, orderDTO.address);
           return ResponseEntity.ok().build();
    }

    public ResponseEntity<Order> getOrderById(Long id) {

           Optional<Order> order = orderService.getOrderById(id);
            if(order.isPresent()){
                return ResponseEntity.ok(order.get());
            }
            else{
                throw new OrderNotFoundException("id: " + id);
            }
    }
    @GetMapping("/FetchOrders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/GetAllOrders")
    public ResponseEntity<List<Order>> getAllOrdersByClient(Long clientId ) {
        List<Order> orders = orderService.getAllOrdersByClient(clientId);
        return ResponseEntity.ok(orders);

    }

    public ResponseEntity deleteOrder(Long id ) {
            orderService.deleteOrder(id);
            return ResponseEntity.ok().build();

    }

    @GetMapping("/ChangeOrderStatus")
    public ResponseEntity changeOrderStatus(Long orderId, Status status ) {

            orderService.changeOrderStatus(orderId,status);
            return ResponseEntity.ok().build();

    }
}
