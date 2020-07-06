package com.kk.bookstore.dao;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.BookEntity;
import com.kk.bookstore.entity.BookImage;

import java.util.List;
import java.util.Map;

public interface BookDao {
    BookEntity findOne(Integer id);

    List<BookEntity> getBooks();

    Msg editBook(BookEntity book);

    Msg deleteBook(Integer id);

    Msg addBook(BookEntity book);

    int updateBookImage(BookImage bookImage);
}
