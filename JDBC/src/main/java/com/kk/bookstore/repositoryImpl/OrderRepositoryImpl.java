package com.kk.bookstore.repositoryImpl;

import com.kk.bookstore.Util.HibernateUtil;
import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.*;
import com.kk.bookstore.repository.OrderRepository;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.query.Query;
import org.springframework.stereotype.Component;

import java.awt.print.Book;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component
public class OrderRepositoryImpl implements OrderRepository {
    @Override
    public List<OrderEntity> getOrders(Integer userId) {
        UserEntity auser = null;
        try{
            Session session;
            session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            auser = session.get(UserEntity.class,userId);
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            HibernateUtil.getSessionFactory().getCurrentSession().getTransaction().rollback();
        }
        assert auser != null;
        return auser.getOrders();
    }

    @Override
    public List<CartEntity> getCart(Integer userId) {
        UserEntity auser = null;
        try{
            Session session;
            session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            auser = session.get(UserEntity.class,userId);
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            HibernateUtil.getSessionFactory().getCurrentSession().getTransaction().rollback();
        }
        assert auser != null;
        return auser.getCart();
    }

    @Override
    public Msg addCart(CartEntity cartInfo) {
        CartEntity aCart = null;
        int userId = cartInfo.getUserId();
        int bookId = cartInfo.getBookId();
        int quantity = cartInfo.getQuantity();
        List result = null;
        try{
            String hql = "from CartEntity as cart where cart.userId=:userId and cart.bookId=:bookId";
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            Query query = session.createQuery(hql);
            query.setParameter("userId", userId);
            query.setParameter("bookId", bookId);
            result = query.list();
            session.getTransaction().commit();

            if(result == null || result.isEmpty()){
                session = HibernateUtil.getSessionFactory().getCurrentSession();
                session.beginTransaction();
                BookEntity aBook = session.get(BookEntity.class, bookId);
                UserEntity aUser = session.get(UserEntity.class, userId);

                cartInfo.setBookInfo(aBook);
                session.save(cartInfo);
                aUser.getCart().add(cartInfo);
                session.getTransaction().commit();
                session.close();

                return new Msg(0,"Create a new cart");
            }
            else{
                session = HibernateUtil.getSessionFactory().getCurrentSession();
                session.beginTransaction();

                aCart = (CartEntity) result.get(0);
                aCart.setQuantity(quantity);

                session.update(aCart);
                session.getTransaction().commit();
                session.close();

                return new Msg(0,"Updated an existing cart");
            }
        }catch (Exception e){
            HibernateUtil.getSessionFactory().getCurrentSession().getTransaction().rollback();
        }

        return new Msg(1,"Failed in updating cart");
    }

    @Override
    public Msg deleteCart(Integer cartId) {
        try{
            String hql = "delete from CartEntity as cart where cart.id=:cartId";
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            Query query = session.createQuery(hql);
            query.setParameter("cartId", cartId);
            query.executeUpdate();
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        Msg message = new Msg(0, "Delete succeed. id="+cartId);
        return message;
    }

    @Override
    public Integer addOrder(Integer userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = sdf.format(new Date());
        Integer maxId = null;
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            OrderEntity newOrder = new OrderEntity();
            newOrder.setUserId(userId);
            newOrder.setTime(time);
            session.save(newOrder);
            session.getTransaction().commit();

            session = HibernateUtil.getSessionFactory().getCurrentSession();
            session.beginTransaction();
            String hql = "select max(orders.orderId) from OrderEntity as orders";
            List maxIdList = session.createQuery(hql).list();
            maxId = (Integer) maxIdList.get(0);
            session.getTransaction().commit();
            session.close();

        }catch(Exception e){
            e.printStackTrace();
        }

        return maxId;
    }

    @Override
    public Integer addOrderItem(OrderItemEntity orderItem) {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            session.save(orderItem);
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            e.printStackTrace();
            return 1;
        }
        return 0;
    }

    @Override
    public List<CartEntity> getCartByArray(List<Integer> cartList) {
        List result;
        try{
            String hql = "from CartEntity as cart where cart.id in (:cartArray)";
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            Query query =session.createQuery(hql);
            query.setParameter("cartArray",cartList);
            result = query.list();
            session.getTransaction().commit();
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
        return result;
    }
}
