package com.kk.bookstore.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "cart", schema = "bookstore")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})

public class CartEntity {
    private int id;
    private int userId;
    private int bookId;
    private int quantity;

    BookEntity bookInfo;

    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    public int getId(){return id;}

    public void setId(int id){this.id = id;}

    @Basic
    @Column(name = "user_id")
    public int getUserId(){return userId;}

    public void setUserId(int userId){this.userId = userId;}

    @Basic
    @Column(name = "book_id")
    public int getBookId(){return bookId;}

    public void setBookId(int bookId){this.bookId = bookId;}

    @Basic
    @Column(name = "quantity")
    public int getQuantity(){return quantity;}

    public void setQuantity(int quantity){this.quantity = quantity;}

    @ManyToOne(targetEntity = BookEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    public BookEntity getBookInfo(){return bookInfo;}

    public void setBookInfo(BookEntity bookInfo){this.bookInfo = bookInfo;}
}
