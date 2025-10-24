package uni.progweb.porkycakes.model.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentRespDto {
	private Integer id;
	private Integer productId;
	private boolean approved;
	private String user;
	private String text;
}
