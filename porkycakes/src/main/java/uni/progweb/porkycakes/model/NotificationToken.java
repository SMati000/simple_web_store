package uni.progweb.porkycakes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Base64;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class NotificationToken {
	@Id
	private String user;

	@Getter(AccessLevel.NONE)
	private String expoToken;

	public String getExpoToken() {
		return new String(Base64.getDecoder().decode(expoToken));
	}
}
