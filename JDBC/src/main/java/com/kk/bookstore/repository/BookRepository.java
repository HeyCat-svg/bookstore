package com.kk.bookstore.repository;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.BookEntity;

import java.util.List;
import java.util.Map;

public interface BookRepository {
    List<BookEntity> getBooks();

    BookEntity getOne(Integer id);

    Msg editBook(BookEntity book);

    Msg deleteBook(Integer id);

    int addBook(BookEntity book);
}
