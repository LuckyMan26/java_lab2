package com.example.demo;

import com.example.demo.controllers.ProductController;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.view.MustacheViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.servlet.ViewResolver;

@SpringBootApplication
public class DemoApplication {
	private static final Logger logger = LogManager.getLogger(DemoApplication.class);
	public static void main(String[] args) {
		logger.info("HELLLLLLLO");
		SpringApplication.run(DemoApplication.class, args);
	}

}
