package com.kk.bookstore.controller;

import com.kk.bookstore.entity.BookEntity;
import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.entity.BookImage;
import com.kk.bookstore.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Book;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
public class BookController {
    @Autowired
    private BookService bookService;

    @RequestMapping("/getBooks")        // correspond to "/dataRequest"
    public List<BookEntity> getBooks(){
        return bookService.getBooks();
    }

    @RequestMapping("/getBook")         // correspond to "/QueryServlet"
    public BookEntity getBook(@RequestParam("id") Integer id){
        return bookService.findBookById(id);
    }

    @RequestMapping("/editBook")
    public Msg editBook(@RequestBody Map<String, String> book){
        BookEntity aBook = new BookEntity();
        aBook.setId(Integer.parseInt(book.get("key")));
        aBook.setInventory(Integer.parseInt(book.get("inventory")));
        aBook.setPrice(new BigDecimal(book.get("price")));
        aBook.setIsbn(book.get("isbn"));
        aBook.setName(book.get("name"));
        aBook.setAuthor(book.get("author"));
        aBook.setImage("null");
        return bookService.editBook(aBook);
    }

    @RequestMapping("/addBook")
    public Msg addBook(@RequestBody Map<String, String> book){
        BookEntity aBook = new BookEntity();
        aBook.setName(book.get("name"));
        aBook.setIsbn(book.get("isbn"));
        aBook.setType(book.get("type"));
        aBook.setAuthor(book.get("author"));
        aBook.setPrice(new BigDecimal(book.get("price")));
        aBook.setDescription(book.get("description"));
        aBook.setInventory(Integer.parseInt(book.get("inventory")));
        aBook.setImage("http://"+book.get("url"));

        BookImage bookImage = new BookImage();
        bookImage.setBookName(book.get("name"));
        bookImage.setDescription(book.get("description"));
        bookImage.setImageBase64(book.get("imageBase64"));

        aBook.setBookImage(bookImage);

        return bookService.addBook(aBook);
    }

    @RequestMapping("/deleteBook")
    public Msg deleteBook(@RequestParam("id") Integer id){
        return bookService.deleteBook(id);
    }

    @RequestMapping("/updateBookImage")
    public Msg updateBookImage(@RequestBody Map<String, String> bookImage){
        BookImage image = new BookImage();

        image.setBookId(Integer.parseInt(bookImage.get("id")));
        image.setBookName(bookImage.get("name"));
        image.setDescription("");
        image.setImageBase64(bookImage.get("imageBase64"));

        return bookService.updateBookImage(image);
    }
}
