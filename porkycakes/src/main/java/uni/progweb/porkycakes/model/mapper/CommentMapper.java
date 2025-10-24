package uni.progweb.porkycakes.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uni.progweb.porkycakes.model.Comment;
import uni.progweb.porkycakes.model.request.CommentReqDto;
import uni.progweb.porkycakes.model.response.CommentRespDto;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "product.id", source = "productId")
	@Mapping(target = "approved", constant = "false")
	@Mapping(target = "user", ignore = true)
	Comment fromRequestDto(CommentReqDto commentReqDto);

	@Mapping(target = "productId", source = "product.id")
	CommentRespDto fromComment(Comment comment);

	List<CommentRespDto> fromCommentList(List<Comment> comment);
}
