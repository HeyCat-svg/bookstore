package com.kk.bookstore.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigInteger;

@Document(collection = "person_icon")
public class UserIcon {
    private BigInteger id;  //this id is _id in document
    private int userId;
    private  String userName;
    private String iconBase64;

    @Id
    public BigInteger getId(){return id;}

    public void setId(BigInteger id){this.id = id;}

    @Field("id")
    public int getUserId(){return userId;}

    public void setUserId(int userId){this.userId = userId;}

    @Field("name")
    public String getUserName(){return userName;}

    public void setUserName(String userName){this.userName = userName;}

    @Field("iconBase64")
    public String getIconBase64(){return iconBase64;}

    public void setIconBase64(String iconBase64){this.iconBase64 = iconBase64;}
}
