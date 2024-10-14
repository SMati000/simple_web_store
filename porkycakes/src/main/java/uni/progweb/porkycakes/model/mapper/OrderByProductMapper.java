package uni.progweb.porkycakes.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uni.progweb.porkycakes.model.OrderByProduct;
import uni.progweb.porkycakes.model.request.OrderByProductReqDto;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderByProductMapper {
	@Mapping(target = "id", ignore = true)
	@Mapping(target = "product.id", source = "productId")
	OrderByProduct fromRequestDto(OrderByProductReqDto orderByProductReqDto);

	List<OrderByProduct> fromRequestsDto(List<OrderByProductReqDto> ordersByProductReqDto);
}
