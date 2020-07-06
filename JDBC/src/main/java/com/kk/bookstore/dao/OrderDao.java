package com.kk.bookstore.dao;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.CartEntity;
import com.kk.bookstore.entity.OrderEntity;
import com.kk.bookstore.entity.OrderItemEntity;

import java.util.List;
import java.util.Map;

public interface OrderDao {
    List<OrderEntity> getOrders(Integer userId);

    List<CartEntity> getCart(Integer userId);

    Msg addCart(CartEntity cartInfo);

    Msg deleteCart(Integer cartId);

    Integer addOrder(Integer userId);

    Integer addOrderItem(OrderItemEntity orderItem);

    List<CartEntity> getCartByArray(List<Integer> cartList);
}
