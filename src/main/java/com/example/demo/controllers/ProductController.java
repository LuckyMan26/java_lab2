package com.example.demo.controllers;

import com.example.demo.dto.ProductDTO;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.models.Product;
import com.example.demo.service.ProductService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@RestController
public class ProductController {
    private static final Logger logger = LogManager.getLogger(ProductController.class);
    private ProductService productService;
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping(path ="/AddProduct")

    public ResponseEntity addProduct(@RequestBody ProductDTO productDTO) {
        logger.info("Add product!");
        try {

            productService.addProduct(productDTO.name, productDTO.description, productDTO.price, productDTO.imageData);
        }
        catch (RuntimeException exception){
            throw new RuntimeException();
        }
        return ResponseEntity.ok().build();

    }
    @GetMapping(path = "/GetGoodById")
    public ResponseEntity<Product> getGoodById(Long id) {

        Optional<Product> product = productService.getProductById(id);
        if(product.isPresent()){
            return ResponseEntity.ok(product.get());
        }
        else {
            throw new ProductNotFoundException("id: " + id);
        }

    }
    @GetMapping(path ="/GoodServlet")
    public ResponseEntity<List<Product>> getAllGoods() {

        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);

    }
    @GetMapping(path = "/decreaseQuantity")
    public ResponseEntity decreaseQuantity(Long product_id, int num) {

        logger.info("Decreasing number of: " + product_id + " " + num);

        productService.decreaseQuantity(product_id,num);
        return ResponseEntity.ok().build();

    }

    public ResponseEntity deleteGood(Long id ) {

            productService.deleteProduct(id);
            return ResponseEntity.ok().build();

    }
    @PostMapping(path="/GetGoodsListById")
    public ResponseEntity<List<Product>> GetGoodsListById(@RequestBody ArrayList<Long> body){
        List<Long> products = body;
        logger.info(products.size());
        List<Product> productArrayList = new ArrayList<>();
        logger.info(products);
        for (int i = 0; i < products.size(); i++) {
            Long id = products.get(i);

            logger.info(id);
            Optional<Product> p = productService.getProductById(id);
            if(p.isPresent()) {
                productArrayList.add(p.get());
            }
            else{
                throw new ProductNotFoundException("id: " + id);
            }
        }
        return ResponseEntity.ok(productArrayList);
    }
}
