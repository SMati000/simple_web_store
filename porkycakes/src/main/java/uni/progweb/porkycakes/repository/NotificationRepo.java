package uni.progweb.porkycakes.repository;

import org.springframework.data.repository.CrudRepository;
import uni.progweb.porkycakes.model.NotificationToken;

public interface NotificationRepo extends CrudRepository<NotificationToken, String> {}
