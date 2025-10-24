package uni.progweb.porkycakes.utils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Component
public class ExpoNotificationsApi {
	@Value("${expo.server}") String expoEndpoint;

	public void sendExpoNotification(String expoPushToken, String body) {
		RestTemplate restTemplate = new RestTemplate();

		Map<String, Object> payload = new HashMap<>();
		payload.put("to", expoPushToken);
		payload.put("title", "Porky Cakes");
		payload.put("body", body);
		payload.put("sound", "default");

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

		ResponseEntity<String> response = restTemplate.postForEntity(expoEndpoint, request, String.class);
		System.out.println(response.getBody());
	}
}
