package cz.aldiix.stacktemplate.springkotlinnextjs.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("api/v1")
class APIv1 {

    @GetMapping
    fun hello(): Map<String, String> {
        return mapOf(
            "message" to "Hello from Spring Boot Kotlin API v1!",
            "timestamp" to DateTimeFormatter.ISO_INSTANT.format(java.time.Instant.now())
        )
    }
}