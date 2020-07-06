package com.kk.bookstore.daoImpl;

import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.dao.BookDao;
import com.kk.bookstore.entity.BookEntity;
import com.kk.bookstore.entity.BookImage;
import com.kk.bookstore.repository.BookImageRepository;
import com.kk.bookstore.repository.BookRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class BookDaoImpl implements BookDao{
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BookImageRepository bookImageRepository;


    @Override
    public BookEntity findOne(Integer id) {
        BookEntity aBook = bookRepository.getOne(id);
        List<BookImage> bookImage = bookImageRepository.findByBookId(id);
        if(bookImage!=null && !bookImage.isEmpty()){
            aBook.setBookImage(bookImage.get(0));
        }
        return aBook;
    }

    @Override
    public List<BookEntity> getBooks() {
        List<BookEntity> books = bookRepository.getBooks();
        Iterator iter = books.iterator();
        while(iter.hasNext()){
            BookEntity aBook = (BookEntity) iter.next();
            int bookId= aBook.getId();
            List<BookImage> bookImage = bookImageRepository.findByBookId(bookId);
            if(bookImage!=null && !bookImage.isEmpty()){
                aBook.setBookImage(bookImage.get(0));
            }
        }
        return books;
    }

    @Override
    public Msg editBook(BookEntity book) {
        return bookRepository.editBook(book);
    }

    @Override
    public Msg deleteBook(Integer id) {
        bookImageRepository.deleteByBookId(id);
        bookRepository.deleteBook(id);
        return new Msg(0, "Delete succeed. id="+id);
    }

    @Override
    public Msg addBook(BookEntity book) {
        int bookId = bookRepository.addBook(book);
        BookImage bookImage = book.getBookImage();
        bookImage.setBookId(bookId);
        bookImageRepository.save(bookImage);
        return new Msg(0, "Save succeed.");
    }

    @Override
    public int updateBookImage(BookImage bookImage) {
        int bookId = bookImage.getBookId();
        BookImage image;
        List<BookImage> result = bookImageRepository.findByBookId(bookId);
        if(result != null && !result.isEmpty()){
            image = (BookImage) result.get(0);
            image.setImageBase64((bookImage.getImageBase64()));
            bookImageRepository.save(image);
        }
        else{
            bookImageRepository.save(bookImage);
        }
        return 0;
    }
}
