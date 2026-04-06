package com.rehan.scheme.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtFilter implements Filter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // Allow OPTIONS preflight requests (CORS)
        if (req.getMethod().equalsIgnoreCase("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        String path = req.getRequestURI();
        String method = req.getMethod();

        // Allow public APIs
        if (path.startsWith("/auth") ||
                (path.startsWith("/schemes") && method.equals("GET") && !path.contains("/admin"))) {
            chain.doFilter(request, response);
            return;
        }

        String header = req.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json");
            res.getWriter().write("{\"error\":\"Unauthorized - Token missing\"}");
            return;
        }

        String token = header.substring(7);
        if (!jwtUtil.validateToken(token)) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json");
            res.getWriter().write("{\"error\":\"Invalid or expired JWT\"}");
            return;
        }

        chain.doFilter(request, response);
    }
}
