package asseco.interview.authorization.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/info")
public class DemoController {
    @GetMapping
    public ResponseEntity<String> revealData(){
        return ResponseEntity.ok(
                "Hi. Now you have access to this secret. Do you know how I found out that I am fat?\n\n" +
                        "My wife caught me holding in my stomach while standing on the bathroom scales.\n\n" +
                        "\"Ha! That's not gonna help, you idiot!\n\n" +
                        "It does. It's the only way I can see the numbers."
        );
    }
}
