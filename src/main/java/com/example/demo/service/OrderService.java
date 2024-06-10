package com.example.demo.service;

import com.example.demo.exception.UserNotFoundException;
import com.example.demo.models.Order;
import com.example.demo.models.Product;
import com.example.demo.models.Status;
import com.example.demo.models.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository,UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void addOrder(User user, List<Product> products, Date orderDate, Status status, double totalPrice, String fullName, String address) {
        Order order = new Order();
        order.setUser(user);
        order.setProducts(products);
        order.setOrderDate(orderDate);
        order.setStatus(String.valueOf(status));
        order.setTotalPrice(totalPrice);
        order.setFullName(fullName);
        order.setAddress(address);
        orderRepository.save(order);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getAllOrdersByClient(Long clientId) {
        Optional<User> user = userRepository.findById(clientId);
        if(user.isPresent()) {
            return orderRepository.findByUser(user.get());
        }
        else{
            throw new UserNotFoundException("id: " + clientId);
        }
    }

    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Transactional
    public void changeOrderStatus(Long orderId, Status status) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(String.valueOf(status));
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found with id: " + orderId);
        }
    }
}
