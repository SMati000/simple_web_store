package uni.progweb.porkycakes.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uni.progweb.porkycakes.model.Comment;
import uni.progweb.porkycakes.model.mapper.CommentMapper;
import uni.progweb.porkycakes.model.request.CommentReqDto;
import uni.progweb.porkycakes.model.response.CommentRespDto;
import uni.progweb.porkycakes.repository.CommentRepo;
import uni.progweb.porkycakes.repository.ProductRepo;
import uni.progweb.porkycakes.utils.exceptions.ErrorCodes;
import uni.progweb.porkycakes.utils.exceptions.PorkyException;
import java.util.List;
import java.util.Optional;

@Validated
@RestController
@RequestMapping("/comments")
public class CommentController extends BaseController {
	@Autowired CommentRepo commentRepo;
	@Autowired ProductRepo productRepo;
	@Autowired CommentMapper commentMapper;

	@PostMapping
	@ResponseBody
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('pc_customer_premium')")
	public CommentRespDto postComment(@RequestBody @Valid CommentReqDto commentReqDto) throws PorkyException {
		if(!productRepo.existsById(commentReqDto.getProductId())) {
			throw new PorkyException(ErrorCodes.PRODUCT_NOT_FOUND);
		}

		Comment comment = commentMapper.fromRequestDto(commentReqDto);

		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String email = ((Jwt)authentication.getPrincipal()).getClaimAsString("email");
			comment.setUser(email);
		} catch(Exception e) {
			throw new PorkyException(ErrorCodes.SOMETHING_WENT_WRONG);
		}

		commentRepo.save(comment);
		return commentMapper.fromComment(comment);
	}

	@GetMapping
	@ResponseBody
	@PreAuthorize("(#approved == false && hasRole('pc_admin')) || #approved == true")
	public List<CommentRespDto> getPublicComments(
		@RequestParam(name = "productId", required = true) Integer productId,
		@RequestParam(name = "approved", required = false, defaultValue = "true") boolean approved
	) throws PorkyException {
		return commentMapper.fromCommentList(commentRepo.getComments(productId, approved));
	}

	@PatchMapping("/{cid}")
	@ResponseBody
	@PreAuthorize("hasRole('pc_admin')")
	public void approveComment(
		@PathVariable Integer cid,
		@RequestParam(name = "approve", required = true) boolean approve
	) throws PorkyException {
		Optional<Comment> commentOp = commentRepo.findById(cid);

		if(commentOp.isEmpty()) {
			throw new PorkyException(ErrorCodes.COMMENT_NOT_FOUND);
		}

		// permite eliminar comentarios que ya fueron aprobados
		if(!approve) {
			commentRepo.deleteById(cid);
			return;
		}

		Comment comment = commentOp.get();
		comment.setApproved(true);
		commentRepo.save(comment);
	}
}
