package com.kk.bookstore.serviceimpl;


import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.UserAuthEntity;
import com.kk.bookstore.dao.UserDao;
import com.kk.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public Msg register(Map<String, String> userInfo) {
        return userDao.register(userInfo);
    }

    @Override
    public UserAuthEntity checkUser(String username, String password) {
        return userDao.checkUser(username, password);
    }

    @Override
    public List<UserAuthEntity> getUsers() {
        List<UserAuthEntity> users = userDao.getUsers();
        Iterator iter = users.iterator();
        while(iter.hasNext()){
            UserAuthEntity aUser = (UserAuthEntity) iter.next();
            aUser.setPassword("");
        }
        return users;
    }

    @Override
    public Msg banUser(Integer userId) {
        int result = userDao.banUser(userId);
        if(result == 0){
            return new Msg(0, "Banned! UserId: "+userId);
        }
        else{
            return new Msg(1, "Failed! UserId: "+userId);
        }
    }

    @Override
    public Msg unblockUser(Integer userId) {
        int result = userDao.unblockUser(userId);
        if(result == 0){
            return new Msg(0, "Unblocked! UserId: "+userId);
        }
        else{
            return new Msg(1, "Failed! UserId: "+userId);
        }
    }
}
