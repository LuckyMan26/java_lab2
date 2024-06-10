package com.example.demo.controllers;

import com.example.demo.dto.BasketDTO;
import com.example.demo.dto.ReviewDTO;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.exception.ReviewNotFoundException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.models.Review;
import com.example.demo.models.User;
import com.example.demo.service.ProductService;
import com.example.demo.service.ReviewService;
import com.example.demo.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.demo.models.Product;

import java.util.List;
import java.util.Optional;
@Controller
public class ReviewController {
    private static final Logger logger = LogManager.getLogger(ReviewController.class);
    private ReviewService reviewService;
    private ProductService productService;
    private UserService userService;
    public ReviewController(ReviewService reviewService,ProductService productService,UserService userServices){
        this.reviewService = reviewService;
        this.productService = productService;
        this.userService = userServices;
    }
    @PostMapping("/AddReview")
    public ResponseEntity addReview(@Validated @RequestBody ReviewDTO reviewDTO) {
        Optional<Product> product = productService.getProductById(reviewDTO.productId);
        if(product.isPresent()) {
            Optional<User> user = userService.getUserById(reviewDTO.user_id);
            if(user.isPresent()) {
                reviewService.addReview(user.get(), product.get(), reviewDTO.text, reviewDTO.stars);
                return ResponseEntity.ok().build();
            }
            else{
                throw new UserNotFoundException("id: " + reviewDTO.user_id);
            }
        }
        else{
            throw new ProductNotFoundException("id: " + reviewDTO.productId);
        }


    }
    @PostMapping("/GetReviewById")
    public ResponseEntity<Review> getReviewId(Long id ) {

           Optional<Review> review = reviewService.getReviewById(id);
           if(review.isPresent()){
               return ResponseEntity.ok(review.get());
           }
           else{
               throw new ReviewNotFoundException("id: " + id);
           }
    }
    @GetMapping("/GetReviews")
    public ResponseEntity<List<Review>> getAllReviewsById(Long id ) {

        List<Review> reviews = reviewService.getAllReviewsByProductId(id);
        return ResponseEntity.ok(reviews);

    }

    public ResponseEntity deleteReview(Long id ) {

        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();

    }
}
