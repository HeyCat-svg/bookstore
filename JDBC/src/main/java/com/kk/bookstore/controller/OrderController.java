package com.kk.bookstore.controller;

import com.alibaba.fastjson.JSONObject;
import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.CartEntity;
import com.kk.bookstore.entity.OrderEntity;
import com.kk.bookstore.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
public class OrderController {
    @Autowired
    private OrderService orderService;

    @RequestMapping("/getOrders")
    public List<OrderEntity> getOrders(@RequestParam("userId") Integer userId){
        return orderService.getOrders(userId);
    }

    @RequestMapping("/getCart")
    public List<CartEntity> getCart(@RequestParam("userId") Integer userId){
        return orderService.getCart(userId);
    }

    @RequestMapping("/addCart")
    public Msg addCart(@RequestBody Map<String, String> cartInfo){
        int userId = Integer.parseInt(cartInfo.get("userId"));
        int bookId = Integer.parseInt(cartInfo.get("bookId"));
        int quantity = Integer.parseInt(cartInfo.get("quantity"));
        CartEntity cart = new CartEntity();
        cart.setUserId(userId);
        cart.setBookId(bookId);
        cart.setQuantity(quantity);
        return orderService.addCart(cart);
    }

    @RequestMapping("/deleteCart")
    public Msg deleteCart(@RequestParam("cartId") Integer cartId){
        return orderService.deleteCart(cartId);
    }

    @RequestMapping("/cartToOrder")
    public Msg cartToOrder(@RequestBody Map<String, String> cartInfo){
        String data = cartInfo.get("data");
        List<Integer> cartArray = JSONObject.parseArray(data, Integer.class);
        return orderService.cartToOrder(cartArray);
    }
}
