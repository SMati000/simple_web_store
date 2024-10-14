package uni.progweb.porkycakes.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uni.progweb.porkycakes.model.Product;
import uni.progweb.porkycakes.model.request.ProductReqDto;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
	@Mapping(target = "id", ignore = true)
	Product fromRequestDto(ProductReqDto productReqDto);

	List<Product> fromRequestDtoList(List<ProductReqDto> dtoList);
}
