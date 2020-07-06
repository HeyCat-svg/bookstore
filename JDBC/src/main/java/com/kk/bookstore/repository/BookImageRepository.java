package com.kk.bookstore.repository;

import com.kk.bookstore.entity.BookImage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookImageRepository extends MongoRepository<BookImage, Integer>{
    List<BookImage> findByBookName(String name);
    List<BookImage> findByBookId(int bookId);

    void deleteByBookName(String name);
    void deleteByBookId(int bookId);
}
