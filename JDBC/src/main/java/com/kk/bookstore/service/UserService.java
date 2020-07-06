package com.kk.bookstore.service;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.UserAuthEntity;

import java.util.List;
import java.util.Map;

public interface UserService {
    Msg register(Map<String, String> userInfo);

    UserAuthEntity checkUser(String username, String password);

    List<UserAuthEntity> getUsers();

    Msg banUser(Integer userId);

    Msg unblockUser(Integer userId);
}
