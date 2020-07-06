package com.kk.bookstore.service;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.CartEntity;
import com.kk.bookstore.entity.OrderEntity;

import java.util.List;
import java.util.Map;

public interface OrderService {
    List<OrderEntity> getOrders(Integer userId);

    List<CartEntity> getCart(Integer userId);

    Msg addCart(CartEntity cartInfo);

    Msg deleteCart(Integer cartId);

    Msg cartToOrder(List<Integer> cartArray);
}
