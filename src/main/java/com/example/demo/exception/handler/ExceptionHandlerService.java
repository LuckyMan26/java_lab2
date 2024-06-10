package com.example.demo.exception.handler;

import com.example.demo.dto.ErrorInfo;
import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.exception.ReviewNotFoundException;
import com.example.demo.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ExceptionHandlerService {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ProductNotFoundException.class, UserNotFoundException.class, ReviewNotFoundException.class
            })
    @ResponseBody
    public ErrorInfo exceptionHandler(Exception ex){
        return new ErrorInfo().setTimestamp(System.currentTimeMillis())
                .setMessage(ex.getMessage())
                .setDeveloperMessage(ex.toString());
    }

}