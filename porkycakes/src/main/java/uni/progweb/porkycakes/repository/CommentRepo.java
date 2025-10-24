package uni.progweb.porkycakes.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import uni.progweb.porkycakes.model.Comment;
import java.util.List;

public interface CommentRepo extends CrudRepository<Comment, Integer>  {
	@Query("SELECT c FROM Comment c WHERE c.approved = :approved AND c.product.id = :productId")
	List<Comment> getComments(Integer productId, boolean approved);
}
