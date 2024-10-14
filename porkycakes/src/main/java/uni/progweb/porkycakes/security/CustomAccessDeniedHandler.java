package uni.progweb.porkycakes.security;

import java.io.IOException;
import java.io.OutputStream;

import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import uni.progweb.porkycakes.utils.exceptions.ErrorCodes;
import uni.progweb.porkycakes.utils.exceptions.ErrorResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {
	@Override
	public void handle(
			HttpServletRequest request,
			HttpServletResponse response,
			AccessDeniedException accessDeniedException)
			throws IOException, ServletException {
		ErrorCodes e = ErrorCodes.FORBIDDEN;
		response.setStatus(HttpServletResponse.SC_FORBIDDEN);

		if (request.getHeader("authorization") == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			e = ErrorCodes.UNAUTHORIZED;
		}

		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		OutputStream responseStream = response.getOutputStream();
		ObjectMapper mapper = new ObjectMapper();
		mapper.writeValue(responseStream, new ErrorResponse(e.getErrorCode(), e.getMessage()));
		responseStream.flush();
	}
}