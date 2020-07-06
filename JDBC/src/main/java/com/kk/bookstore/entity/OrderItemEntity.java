package com.kk.bookstore.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "orderitem", schema = "bookstore")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
public class OrderItemEntity {
    private int id;
    private int orderId;
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
    @Column(name = "order_id")
    public int getOrderId(){return orderId;}

    public void setOrderId(int orderId){this.orderId = orderId;}

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
