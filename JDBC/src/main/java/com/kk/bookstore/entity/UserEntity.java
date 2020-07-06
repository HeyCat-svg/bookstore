package com.kk.bookstore.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "user", schema = "bookstore")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
public class UserEntity {
    private int id;
    private String nickname;
    private String name;
    private String tel;
    private String address;
    private String email;

    private List<OrderEntity> orders = new ArrayList<>();
    private List<CartEntity> cart = new ArrayList<>();

    private UserIcon userIcon;

    @Id
    @Column(name = "user_id")
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "nickname")
    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "tel")
    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    @Basic
    @Column(name = "address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Basic
    @Column(name = "email")
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    @OneToMany(targetEntity = OrderEntity.class, cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    @JoinColumn(name="user_id")
    public List<OrderEntity> getOrders(){return orders;}

    public void setOrders(List<OrderEntity> orders){this.orders = orders;}

    @OneToMany(targetEntity = CartEntity.class, cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    @JoinColumn(name = "user_id")
    public List<CartEntity> getCart(){return cart;}

    public void setCart(List<CartEntity> cart){this.cart = cart;}

    @Transient
    public UserIcon getUserIcon(){return userIcon;}

    public void setUserIcon(UserIcon userIcon){this.userIcon = userIcon;}



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserEntity that = (UserEntity) o;

        if (id != that.id) return false;
        if (!Objects.equals(nickname, that.nickname)) return false;
        if (!Objects.equals(name, that.name)) return false;
        if (!Objects.equals(tel, that.tel)) return false;
        if (!Objects.equals(address, that.address)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (nickname != null ? nickname.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (tel != null ? tel.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        return result;
    }
}
