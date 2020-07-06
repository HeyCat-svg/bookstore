package com.kk.bookstore.repositoryImpl;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.BookEntity;
import com.kk.bookstore.repository.BookRepository;
import com.kk.bookstore.Util.HibernateUtil;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
public class BookRepositoryImpl implements BookRepository{
    @Override
    public List<BookEntity> getBooks() {
        List<BookEntity> result = null;
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            result = session.createQuery("from BookEntity ").list();
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            HibernateUtil.getSessionFactory().getCurrentSession().getTransaction().rollback();
        }
        return result;
    }

    @Override
    public BookEntity getOne(Integer id) {
        // System.out.println(id);
        BookEntity result = null;
        Session session;
        try{
            session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            result = session.get(BookEntity.class,id);
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            HibernateUtil.getSessionFactory().getCurrentSession().getTransaction().rollback();
        }
        return result;
    }

    @Override
    public Msg editBook(BookEntity book) {
        int id = 0;
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            session.update(book);
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            e.printStackTrace();
            return new Msg(1, "Edit failed. id="+id);
        }
        return new Msg(0, "Edit succeed. id="+id);
    }

    @Override
    public Msg deleteBook(Integer id) {
        try{
            String hql = "delete from BookEntity as book where book.id=:id";
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            Query query = session.createQuery(hql);
            query.setParameter("id", id);
            query.executeUpdate();
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        Msg message = new Msg(0, "Delete succeed. id="+id);
        return message;
    }

    @Override
    public int addBook(BookEntity book) {
        int maxId = 0;
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            session.save(book);
            session.getTransaction().commit();

            session = HibernateUtil.getSessionFactory().getCurrentSession();
            session.beginTransaction();
            String hql = "select max(book.id) from BookEntity as book";
            List maxIdList = session.createQuery(hql).list();
            maxId = (int) maxIdList.get(0);
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return maxId;
    }
}
