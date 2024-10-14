package uni.progweb.porkycakes.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uni.progweb.porkycakes.utils.exceptions.ErrorCodes;
import uni.progweb.porkycakes.utils.exceptions.ErrorResponse;
import uni.progweb.porkycakes.utils.exceptions.PorkyException;

@RestController
@RequestMapping("/")
public class BaseController {
	private static final Logger log = LogManager.getFormatterLogger(BaseController.class);

	@GetMapping("/ping")
	@ResponseBody
	public String ping() {
		return "pong";
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
		if (e.getCause() instanceof PorkyException) {
			return handlePorkyException((PorkyException) e.getCause());
		}

		if (e instanceof AccessDeniedException) {
			return handlePorkyException(new PorkyException(ErrorCodes.FORBIDDEN));
		}

		if (e instanceof AuthenticationException) {
			return handlePorkyException(new PorkyException(ErrorCodes.UNAUTHORIZED));
		}

		ErrorResponse body = new ErrorResponse(ErrorCodes.SOMETHING_WENT_WRONG);

		log.error("%s: %s", body.getCode(), body.getMessage(), e);
		return new ResponseEntity<>(body, ErrorCodes.SOMETHING_WENT_WRONG.getStatusCode());
	}

	@ExceptionHandler(PorkyException.class)
	private ResponseEntity<ErrorResponse> handlePorkyException(PorkyException e) {
		ErrorResponse body = new ErrorResponse(e.getErrorCode(), e.getErrorMessage());

		log.warn("%s: %s", body.getCode(), body.getMessage(), e);
		return new ResponseEntity<>(body, e.getStatusCode());
	}
}
