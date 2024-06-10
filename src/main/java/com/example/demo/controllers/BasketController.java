package com.example.demo.controllers;

import com.example.demo.dto.BasketDTO;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.models.Basket;
import com.example.demo.models.Product;
import com.example.demo.models.User;
import com.example.demo.service.BasketService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Optional;

@Controller
public class BasketController {
    private static final Logger logger = LogManager.getLogger(BasketController.class);
    private BasketService basketService;
    private ProductService productService;
    private UserService userService;
    public BasketController(BasketService basketService, ProductService productService, UserService userService){
        this.basketService = basketService;
        this.productService = productService;
        this.userService = userService;
    }
    @PostMapping("/new_product_in_basket")

    public ResponseEntity addProductToBasket(@Validated @RequestBody BasketDTO basketDTO){
        basketService.addProductToBasket( basketDTO.user,basketDTO.items);
        return ResponseEntity.ok().build();

    }
    public ResponseEntity<Basket> getBasketItemById(@PathVariable("id") int id){

            Optional<Basket> basket = basketService.getBasketItemById(Long.valueOf(id));
            if(basket.isPresent()){
                return ResponseEntity.ok(basket.get());
            }
            else{
                throw new RuntimeException("no element");
            }

    }
    @GetMapping("/FetchBasket")
    public ResponseEntity<Basket> getBasketItemByClientId(Long id){
           Optional<Basket> basket = basketService.getBasketItemByClientId(id);
        if(basket.isPresent()){
            return ResponseEntity.ok(basket.get());
        }
        else{
            throw new RuntimeException("no element");
        }

    }
    @GetMapping("/AddItemToBasket")
    public ResponseEntity addOneProductToBasket(Long productId, Long clientId){
        logger.info("addOneProductToBasket" + productId);


                Optional<Basket> basket1 = basketService.getBasketItemByClientId(clientId);
                if (basket1.isEmpty()) {
                    logger.info("basketItem1 == null");
                    ArrayList<Product> arrayList = new ArrayList < > ();
                    Optional<Product> product = productService.getProductById(productId);
                    product.ifPresent(arrayList::add);

                    Optional<User> opt_user= userService.getUserById(clientId);
                    User user = null;
                    if(opt_user.isPresent()) {
                        user = opt_user.get();
                    }
                    else{
                        throw new UserNotFoundException("no user with id: " + clientId);
                    }
                    basketService.addProductToBasket(user, arrayList);
                }
                else {
                    basketService.addOneProductToBasket(productId,clientId);
                }

        return ResponseEntity.ok().build();
    }
    public ResponseEntity deleteBasketItem(Long id){
        basketService.deleteBasketItem(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/RemoveItemFromBasket")
    public ResponseEntity deleteProductInBasket(Long clientId, Long productId ){


                Optional<Basket> basket1 = basketService.getBasketItemByClientId(clientId);
                if(basket1.isPresent()){
                    if (basket1.get().getItems().size()== 1) {
                        logger.info("Here");
                        Basket basket = basket1.get();
                        basketService.deleteBasketItem(basket.getId());
                    }
                    else {
                        basketService.deleteProductInBasket(clientId, productId);
                    }
                }
                return ResponseEntity.ok().build();

    }
    public void clearBasket(Long client_id ){
           basketService.clearBasket(client_id);

    }
}
