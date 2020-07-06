package com.kk.bookstore.dao;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.UserAuthEntity;

import java.util.List;
import java.util.Map;

public interface UserDao {
    Msg register(Map<String, String> userInfo);

    UserAuthEntity checkUser(String username, String password);

    List<UserAuthEntity> getUsers();

    int banUser(Integer userId);

    int unblockUser(Integer userId);
}
