package asseco.interview.authorization.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Povolené originy
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));

        // Povolené HTTP metódy
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Povolené hlavičky
        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));

        // Povoliť odosielanie cookies/tokenov medzi frontend a backend
        config.setAllowCredentials(true);

        // Pridať hlavičky, ktoré môžu byť odoslané v odpovedi
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Registrácia CORS konfigurácie
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}