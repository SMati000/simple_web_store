FROM openjdk:17-alpine

RUN apk add gradle

WORKDIR /app

COPY build.gradle settings.gradle gradlew /app/
COPY gradle /app/gradle
RUN ./gradlew --version

COPY . /app/

ENV spring.datasource.url=jdbc:mysql://host.docker.internal:3306/porkycakes?useSSL=false&serverTimezone=UTC
ENV spring.security.oauth2.resourceserver.jwt.issuer-uri=http://host.docker.internal:8081/realms/porky_cakes_realm

RUN ./gradlew clean build

EXPOSE 8083
CMD ["java", "-jar", "/app/build/libs/porkycakes-0.0.1-SNAPSHOT.jar"]
