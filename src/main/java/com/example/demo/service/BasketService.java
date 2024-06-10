package com.example.demo.service;

import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.models.Basket;
import com.example.demo.models.Product;
import com.example.demo.models.User;
import com.example.demo.repository.BasketRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BasketService {

    private final BasketRepository basketRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public BasketService(BasketRepository basketRepository, ProductRepository productRepository,UserRepository userRepository) {
        this.basketRepository = basketRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void addProductToBasket(User user, List<Product> items) {
        Basket basket = new Basket();

        basket.setUser(user);
        basket.setItems(items);
        basketRepository.save(basket);
    }

    public Optional<Basket> getBasketItemById(Long id) {
        return basketRepository.findById(id);
    }

    public Optional<Basket> getBasketItemByClientId(Long clientId) {
        Optional<User> user = userRepository.findById(clientId);
        if(user.isPresent()) {
            return basketRepository.findBasketByUser(user.get());
        }
        else {
            throw new UserNotFoundException("id " + clientId);
        }
    }

    @Transactional
    public void addOneProductToBasket(Long productId, Long clientId) {
        Optional<User> user = userRepository.findById(clientId);
        if(user.isPresent()) {
            Basket basket = basketRepository.findBasketByUser(user.get())

                    .orElseThrow(() -> new RuntimeException("Basket not found for client: " + clientId));
            List<Product> items = new ArrayList<>(basket.getItems());
            Optional<Product> product = productRepository.findById(productId);
            if (product.isPresent()) {
                items.add(product.get());
            } else {
                throw new ProductNotFoundException("product not found with id: " + productId);
            }
            basket.setItems(items);
            basketRepository.save(basket);
        }
        else{
            throw new UserNotFoundException("id: " + clientId);
        }
    }

    @Transactional
    public void deleteBasketItem(Long id) {
        basketRepository.deleteById(id);
    }

    @Transactional
    public void deleteProductInBasket(Long clientId, Long productId) {
        Optional<User> user = userRepository.findById(clientId);
        if(user.isPresent()) {
            Basket basket = basketRepository.findBasketByUser(user.get())
                    .orElseThrow(() -> new RuntimeException("Basket not found for client: " + clientId));
            List<Product> items = new ArrayList<>(basket.getItems());
            Optional<Product> product = productRepository.findById(productId);
            if (product.isPresent()) {
                items.remove(product.get());
            } else {
                throw new ProductNotFoundException("product not found with id: " + productId);
            }
            basket.setItems(items);
            basketRepository.save(basket);
        }
        else{
            throw new UserNotFoundException("id: " + clientId);
        }
    }

    @Transactional
    public void clearBasket(Long clientId) {
        Optional<User> user = userRepository.findById(clientId);
        if(user.isPresent()) {
            basketRepository.findBasketByUser(user.get())
                    .ifPresent(basketRepository::delete);
        }
        else{
            throw new UserNotFoundException("id not found: " + clientId);
        }
    }
}
