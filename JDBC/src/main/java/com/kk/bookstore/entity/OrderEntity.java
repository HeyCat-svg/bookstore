package com.kk.bookstore.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.criterion.Order;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders", schema = "bookstore")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
public class OrderEntity {
    private int orderId;
    private int userId;
    private String time;

    List<OrderItemEntity> orderItems = new ArrayList<>();


    @Id
    @Column(name = "order_id")
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    public int getOrderId(){return orderId;}

    public void setOrderId(int id){this.orderId = id;}

    @Basic
    @Column(name = "user_id")
    public int getUserId(){return userId;}

    public void setUserId(int userId){this.userId = userId;}

    @Basic
    @Column(name = "time")
    public String getTime(){return time;}

    public void setTime(String time){this.time = time;}

    @OneToMany(targetEntity = OrderItemEntity.class, cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    public List<OrderItemEntity> getOrderItems(){return orderItems;}

    public void setOrderItems(List<OrderItemEntity> orderItems) {this.orderItems = orderItems;}

    // 外键连级操作在双向关系中由many负责 cascade表示one的某条删除 这条也得跟着删
//    @ManyToOne(targetEntity = BookEntity.class, cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
//    @JoinColumn(name="book_id", insertable = false, updatable = false) //JoinColumn在onetomany的双向关系中标在多的一方，表示多的一方的一列作为外键指向one的主键
//    public BookEntity getBookInfo(){return bookInfo;}
//
//    public void setBookInfo(BookEntity bookInfo){this.bookInfo=bookInfo;}
}
