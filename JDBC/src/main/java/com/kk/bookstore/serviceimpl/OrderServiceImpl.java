package com.kk.bookstore.serviceimpl;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.dao.BookDao;
import com.kk.bookstore.entity.BookEntity;
import com.kk.bookstore.entity.CartEntity;
import com.kk.bookstore.entity.OrderEntity;
import com.kk.bookstore.dao.OrderDao;
import com.kk.bookstore.entity.OrderItemEntity;
import com.kk.bookstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private BookDao bookDao;

    @Override
    public List<OrderEntity> getOrders(Integer userId) {
        return orderDao.getOrders(userId);
    }

    @Override
    public List<CartEntity> getCart(Integer userId) {
        return orderDao.getCart(userId);
    }

    @Override
    public Msg addCart(CartEntity cartInfo) {
        return orderDao.addCart(cartInfo);
    }

    @Override
    public Msg deleteCart(Integer cartId) {
        return orderDao.deleteCart(cartId);
    }

    @Override
    public Msg cartToOrder(List<Integer> cartArray) {
        try{
            List<CartEntity> cartList = orderDao.getCartByArray(cartArray);
            Integer userId = ((CartEntity) cartList.get(0)).getUserId();
            Integer maxOrderId = orderDao.addOrder(userId);
            Iterator iter = cartList.iterator();
            while(iter.hasNext()){
                CartEntity item = (CartEntity) iter.next();
                int quantity = item.getQuantity();
                int bookId = item.getBookId();
                OrderItemEntity orderItem = new OrderItemEntity();
                orderItem.setBookId(bookId);
                orderItem.setOrderId(maxOrderId);
                orderItem.setQuantity(quantity);
                orderDao.addOrderItem(orderItem);

                // update book inventory
                BookEntity aBook = bookDao.findOne(bookId);
                aBook.setInventory(aBook.getInventory() - quantity);
                bookDao.editBook(aBook);

                orderDao.deleteCart(item.getId());
            }
        }catch(Exception e){
            e.printStackTrace();
            return new Msg(1, "Purchase failed");
        }

        return new Msg(0, "Purchase succeed");
    }
}
