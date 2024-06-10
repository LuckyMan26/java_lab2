package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

import java.util.List;
@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "basket")
public class Basket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "product_items_id")
    @OneToMany(mappedBy = "id", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Product> items;
    @OneToOne
    private  User user;






    @Override
    public String toString() {
        String res = "";
        res += "BasketItem{" +
                "basketItemId=" + id+" ";

        for (Product item : items){
            res += item.toString() + " ";
        }
        res+="}";
        return res;
    }
}
