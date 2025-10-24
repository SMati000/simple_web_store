package uni.progweb.porkycakes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uni.progweb.porkycakes.model.NotificationToken;
import uni.progweb.porkycakes.repository.NotificationRepo;
import uni.progweb.porkycakes.utils.exceptions.ErrorCodes;
import uni.progweb.porkycakes.utils.exceptions.PorkyException;

@Validated
@RestController
@RequestMapping("/notifications")
public class NotificationController extends BaseController {
	@Autowired NotificationRepo notificationRepo;

	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('pc_admin', 'pc_customer', 'pc_customer_premium')")
	public void storeToken(
		@RequestParam(name = "token", required = true) String token
	) throws PorkyException {
		NotificationToken notificationToken = new NotificationToken();

		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String email = ((Jwt)authentication.getPrincipal()).getClaimAsString("email");
			notificationToken.setUser(email);
		} catch(Exception e) {
			throw new PorkyException(ErrorCodes.FORBIDDEN);
		}

		notificationToken.setExpoToken(token);
		notificationRepo.save(notificationToken);
	}
}
