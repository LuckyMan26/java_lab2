package com.example.demo.service;

import com.example.demo.controllers.ProductController;
import com.example.demo.models.Product;
import com.example.demo.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProductService {
    private static String trimImagePrefix(String imageData) {
        // Define a regular expression pattern to match "data:image/[image_type];base64,"
        Pattern pattern = Pattern.compile("^data:image/[a-zA-Z]+;base64,");
        Matcher matcher = pattern.matcher(imageData);

        // If the pattern is found, remove it from the string
        if (matcher.find()) {
            return imageData.substring(matcher.end());
        } else {
            // Return the original string if the pattern is not found
            return imageData;
        }
    }

    private final ProductRepository productRepository;
    private static final Logger logger = LogManager.getLogger(ProductService.class);

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public void addProduct(String name, String description,int price,String  imageData) {
        logger.info("HERE "+ name + " " + description);
        Product product = new Product();
        product.setName(name);
        String base64String = trimImagePrefix(imageData);
        product.setDescription(description);
        product.setPrice(price);
        product.setImageData(base64String);

        productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllProducts() {
        logger.info("getAllProducts");
        return productRepository.findAll();
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public void decreaseQuantity(Long productId, int num) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            int currentQuantity = product.getQuantityAvailable();
            if (currentQuantity < num) {
                throw new RuntimeException("Insufficient quantity available");
            }
            product.setQuantityAvailable(currentQuantity - num);
            productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + productId);
        }
    }
}
