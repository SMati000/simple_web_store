package uni.progweb.porkycakes.utils;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import uni.progweb.porkycakes.model.Category;

@Configuration
public class EnumConverters implements WebMvcConfigurer {
	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(new categoryConverter());
	}

	private static class categoryConverter implements Converter<String, Category> {
		@Override
		public Category convert(String source) {
			return Category.valueOf(source.toUpperCase());
		}
	}
}