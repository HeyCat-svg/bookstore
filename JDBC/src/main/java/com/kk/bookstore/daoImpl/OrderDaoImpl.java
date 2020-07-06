package com.kk.bookstore.daoImpl;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.BookImage;
import com.kk.bookstore.entity.CartEntity;
import com.kk.bookstore.entity.OrderEntity;
import com.kk.bookstore.dao.OrderDao;
import com.kk.bookstore.entity.OrderItemEntity;
import com.kk.bookstore.repository.BookImageRepository;
import com.kk.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Repository
public class OrderDaoImpl implements OrderDao {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private BookImageRepository bookImageRepository;

    @Override
    public List<OrderEntity> getOrders(Integer userId) {

        List<OrderEntity> orderList = orderRepository.getOrders(userId);

        Iterator iter = orderList.iterator();
        while(iter.hasNext()){
            OrderEntity order = (OrderEntity) iter.next();
            Iterator iter2 = order.getOrderItems().iterator();
            while(iter2.hasNext()){
                OrderItemEntity orderItem = (OrderItemEntity) iter2.next();
                int bookId = orderItem.getBookId();
                List<BookImage> bookImage = bookImageRepository.findByBookId(bookId);
                if(bookImage!=null && !bookImage.isEmpty()){
                    orderItem.getBookInfo().setBookImage(bookImage.get(0));
                }
            }
        }
        return orderList;
    }

    @Override
    public List<CartEntity> getCart(Integer userId) {

        List<CartEntity> cartList = orderRepository.getCart(userId);

        Iterator iter = cartList.iterator();
        while(iter.hasNext()){
            CartEntity cart = (CartEntity) iter.next();
            int bookId = cart.getBookId();
            List<BookImage> bookImage = bookImageRepository.findByBookId(bookId);
            if(bookImage!=null && !bookImage.isEmpty()){
                cart.getBookInfo().setBookImage(bookImage.get(0));
            }
        }
        return cartList;
    }

    @Override
    public Msg addCart(CartEntity cartInfo) {
        return orderRepository.addCart(cartInfo);
    }

    @Override
    public Msg deleteCart(Integer cartId) {
        return orderRepository.deleteCart(cartId);
    }

    @Override
    public Integer addOrder(Integer userId) {
        return orderRepository.addOrder(userId);
    }

    @Override
    public Integer addOrderItem(OrderItemEntity orderItem) {
        return orderRepository.addOrderItem(orderItem);
    }

    @Override
    public List<CartEntity> getCartByArray(List<Integer> cartList) {
        return orderRepository.getCartByArray(cartList);
    }
}
