package com.example.demo.service;

import com.example.demo.models.Product;
import com.example.demo.models.Review;
import com.example.demo.models.User;
import com.example.demo.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public void addReview(User user, Product product, String text, int stars) {
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setText(text);
        review.setStars(stars);
        reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public List<Review> getAllReviewsByProductId(Long productId) {
        return reviewRepository.findAllByProductId(productId);
    }

    @Transactional
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
