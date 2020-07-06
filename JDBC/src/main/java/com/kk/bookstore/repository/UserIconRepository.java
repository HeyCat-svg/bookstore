package com.kk.bookstore.repository;

import com.kk.bookstore.entity.UserIcon;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserIconRepository extends MongoRepository<UserIcon, Integer> {
    List<UserIcon> findByUserId(int userId);
    List<UserIcon> findByUserName(String name);
}
