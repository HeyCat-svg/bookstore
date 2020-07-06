package com.kk.bookstore.serviceimpl;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.dao.BookDao;
import com.kk.bookstore.entity.BookEntity;
import com.kk.bookstore.entity.BookImage;
import com.kk.bookstore.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BookServiceImpl implements BookService{
    @Autowired
    private BookDao bookDao;

    @Override
    public List<BookEntity> getBooks() {
        return bookDao.getBooks();
    }

    @Override
    public BookEntity findBookById(Integer id) {
        return bookDao.findOne(id);
    }

    @Override
    public Msg editBook(BookEntity book) {
        return bookDao.editBook(book);
    }

    @Override
    public Msg deleteBook(Integer id) {
        return bookDao.deleteBook(id);
    }

    @Override
    public Msg addBook(BookEntity book) {
        return bookDao.addBook(book);
    }

    @Override
    public Msg updateBookImage(BookImage bookImage) {
        int result = bookDao.updateBookImage(bookImage);
        if(result == 0){
            return new Msg(0, "Update succeed");
        }
        return new Msg(1, "Update failed");
    }
}
