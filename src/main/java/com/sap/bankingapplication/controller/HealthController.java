package com.sap.bankingapplication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("All OK, Let's go ahead! - from Banking Application");
    }
}

