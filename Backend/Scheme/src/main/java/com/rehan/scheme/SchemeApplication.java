package com.rehan.scheme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SchemeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SchemeApplication.class, args);
    }

}
