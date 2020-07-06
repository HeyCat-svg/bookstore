package com.kk.bookstore.service;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.BookEntity;
import com.kk.bookstore.entity.BookImage;

import java.util.List;
import java.util.Map;

public interface BookService {
    List<BookEntity> getBooks();

    BookEntity findBookById(Integer id);

    Msg editBook(BookEntity book);

    Msg deleteBook(Integer id);

    Msg addBook(BookEntity book);

    Msg updateBookImage(BookImage bookImage);
}
