package com.kk.bookstore.daoImpl;


import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.UserAuthEntity;
import com.kk.bookstore.dao.UserDao;
import com.kk.bookstore.entity.UserIcon;
import com.kk.bookstore.repository.UserIconRepository;
import com.kk.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class UserDaoImpl implements UserDao {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserIconRepository userIconRepository;

    @Override
    public Msg register(Map<String, String> userInfo) {
        return userRepository.register(userInfo);
    }

    @Override
    public UserAuthEntity checkUser(String username, String password) {
        UserAuthEntity userAuth = userRepository.checkUser(username, password);
        if(userAuth!=null){
            // int userId = userAuth.getUserId();
            String userName = userAuth.getUsername();
            List<UserIcon> userIcon = userIconRepository.findByUserName(userName);
            if(userIcon!=null && !userIcon.isEmpty()){
                userAuth.getUser().setUserIcon(userIcon.get(0));
            }
        }
        return userAuth;
    }

    @Override
    public List<UserAuthEntity> getUsers() {
        return userRepository.getUsers();
    }

    @Override
    public int banUser(Integer userId) {
        return userRepository.banUser(userId);
    }

    @Override
    public int unblockUser(Integer userId) {
        return userRepository.unblockUser(userId);
    }
}
