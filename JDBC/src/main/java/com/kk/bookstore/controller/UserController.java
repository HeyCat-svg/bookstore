package com.kk.bookstore.controller;

import com.alibaba.fastjson.JSONObject;
import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.Util.sessionUtil.SessionUtil;
import com.kk.bookstore.entity.UserAuthEntity;
import com.kk.bookstore.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping("/login")
    public Msg checkUser(@RequestBody Map<String, String> userInfo){
        String username = userInfo.get("username");
        String password = userInfo.get("password");
        System.out.println(password);
        UserAuthEntity auth = userService.checkUser(username, password);
        if(auth!=null){
            if(auth.getUserType() == 403){
                return new Msg(1,"Banned! Permission denied.");
            }
            JSONObject obj = new JSONObject();
            obj.put("userId",auth.getUserId());
            obj.put("username",auth.getUsername());
            obj.put("userType",auth.getUserType());
            SessionUtil.setSession(obj);

            JSONObject data = (JSONObject) JSONObject.toJSON(auth);
            data.remove("password");
            return new Msg(0, "Login succeed.",data);
        }
        return new Msg(1,"Login failed.");
    }

    @RequestMapping("/register")
    public Msg register(@RequestBody Map<String, String> userInfo){
        return userService.register(userInfo);
    }

    @RequestMapping("/logout")
    public Msg logout(){
        boolean status = SessionUtil.removeSession();
        if(status){
            return new Msg(0, "Succeed");
        }
        return new Msg(1,"Failed");
    }

    @RequestMapping("/getUsers")
    public List<UserAuthEntity> getUsers(){
        return userService.getUsers();
    }

    @RequestMapping("/checkSession")
    public Msg checkSession(){
        JSONObject auth = SessionUtil.getAuth();
        System.out.println("checkSession"+auth);
        if(auth==null){
            return new Msg(1,"Haven't logged in.");
        }
        else{
            return new Msg(0,"Login succeed.",auth);
        }
    }

    @RequestMapping("/ban")
    public Msg banUser(@RequestParam("userId") Integer userId){
        return userService.banUser(userId);
    }

    @RequestMapping("/unblock")
    public Msg unblockUser(@RequestParam("userId") Integer userId){
        return userService.unblockUser(userId);
    }

}
