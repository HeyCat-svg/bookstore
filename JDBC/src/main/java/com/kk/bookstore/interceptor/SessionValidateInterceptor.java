package com.kk.bookstore.interceptor;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.kk.bookstore.Util.msgUtil.Msg;
import com.kk.bookstore.Util.sessionUtil.SessionUtil;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class SessionValidateInterceptor extends HandlerInterceptorAdapter{
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object obj)
            throws Exception{
        boolean status = SessionUtil.checkAuth();
        if(!status){
            System.out.println("Failed");
            Msg massage = new Msg(1,"Authentication denied.(NOT_LOGIN)");
            sendJsonBack(response, massage);
            return false;
        }
        System.out.println("Success");
        return true;
    }

    private void sendJsonBack(HttpServletResponse response, Msg msg){
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        try (PrintWriter writer = response.getWriter()) {
            writer.println(JSON.toJSONString(msg, SerializerFeature.BrowserCompatible));
            writer.flush();
        } catch (IOException e) {
            System.out.println("send json back error");
        }
    }
}
