FROM amazoncorretto:17 AS build
WORKDIR /app

RUN yum install -y tar gzip

COPY pom.xml mvnw ./
COPY .mvn .mvn

RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B

COPY . .
RUN ./mvnw clean package -DskipTests

FROM amazoncorretto:17
WORKDIR /app

COPY --from=build /app/target/authorization-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]