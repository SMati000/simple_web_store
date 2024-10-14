package uni.progweb.porkycakes.utils.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class PorkyException extends Exception {

	private final String errorCode;
	private final String errorMessage;
	private final HttpStatus statusCode;

	public PorkyException(ErrorCodes er) {
		errorCode = er.getErrorCode();
		errorMessage = er.getMessage();
		statusCode = er.getStatusCode();
	}
}
