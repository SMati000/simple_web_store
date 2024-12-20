package uni.progweb.porkycakes.utils.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class ErrorResponse {
	private String code;
	private String message;

	public ErrorResponse(ErrorCodes errorCode) {
		this(errorCode.getErrorCode(), errorCode.getMessage());
	}
}
