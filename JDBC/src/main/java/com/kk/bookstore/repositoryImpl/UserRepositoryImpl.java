package com.kk.bookstore.repositoryImpl;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.UserAuthEntity;
import com.kk.bookstore.entity.UserEntity;
import com.kk.bookstore.repository.UserRepository;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Component;
import com.kk.bookstore.Util.HibernateUtil;
import com.alibaba.fastjson.JSONObject;

import java.util.List;
import java.util.Map;

@Component
public class UserRepositoryImpl implements UserRepository {
    @Override
    public Msg register(Map<String, String> userInfo) {
        UserAuthEntity userAuth = new UserAuthEntity();
        UserEntity user = new UserEntity();
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();

            userAuth.setUsername(userInfo.get("username"));
            userAuth.setPassword(userInfo.get("password"));
            userAuth.setUserType(0);
            user.setName(userInfo.get("username"));
            user.setNickname(userInfo.get("nickname"));
            user.setTel(userInfo.get("phone"));
            user.setAddress(userInfo.get("address"));
            user.setEmail(userInfo.get("email"));

            session.save(user);
            session.save(userAuth);
            session.getTransaction().commit();
            session.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        JSONObject userObject = (JSONObject) JSONObject.toJSON(user);
        Msg message = new Msg(0,"Register succeed.",userObject);
        return message;
    }

    @Override
    public UserAuthEntity checkUser(String username, String password) {
        String hql = "from UserAuthEntity as auth where auth.username=:username";
        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Query query = session.createQuery(hql);
        query.setParameter("username",username);
        List auser = query.list();
        session.getTransaction().commit();
        session.close();
        if(auser.isEmpty()){
            return null;
        }
        else{
            UserAuthEntity userAuth = (UserAuthEntity) auser.get(0);
            if(!userAuth.getPassword().equals(password)){
                return null;
            }
            return (UserAuthEntity) auser.get(0);
        }
    }

    @Override
    public List<UserAuthEntity> getUsers() {
        List<UserAuthEntity> result = null;
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            result = session.createQuery("from UserAuthEntity as userAuth").list();
            session.getTransaction().commit();
            session.close();
            return result;
        }catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public int banUser(Integer userId) {
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            UserAuthEntity user = session.get(UserAuthEntity.class, userId);
            user.setUserType(403);
            session.save(user);
            session.getTransaction().commit();
            session.close();
            return 0;
        }catch(Exception e){
            e.printStackTrace();
            return 1;
        }
    }

    @Override
    public int unblockUser(Integer userId) {
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            session.beginTransaction();
            UserAuthEntity user = session.get(UserAuthEntity.class, userId);
            user.setUserType(0);
            session.save(user);
            session.getTransaction().commit();
            session.close();
            return 0;
        }catch(Exception e){
            e.printStackTrace();
            return 1;
        }
    }
}
