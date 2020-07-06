package com.kk.bookstore.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigInteger;

@Document(collection = "book_image")
public class BookImage {
    private BigInteger id;
    private int bookId;
    private String bookName;
    private String description;
    private String imageBase64;

    @Id
    public BigInteger getId(){return id;}

    public void setId(BigInteger id){this.id = id;}

    @Field("id")
    public int getBookId(){return bookId;}

    public void setBookId(int bookId){this.bookId = bookId;}

    @Field("name")
    public String getBookName(){return bookName;}

    public void setBookName(String bookName){this.bookName = bookName;}

    @Field("description")
    public String getDescription(){return description;}

    public void setDescription(String description){this.description = description;}

    @Field("imageBase64")
    public String getImageBase64(){return imageBase64;}

    public void setImageBase64(String imageBase64){this.imageBase64 = imageBase64;}
}
