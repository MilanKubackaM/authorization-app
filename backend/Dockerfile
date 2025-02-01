# 1️⃣ Prvý stage - Build aplikácie
FROM amazoncorretto:17 AS build
WORKDIR /app

# Nainštalujeme potrebné nástroje
RUN yum install -y tar gzip

COPY pom.xml mvnw ./
COPY .mvn .mvn

# Uistíme sa, že `mvnw` má správne práva na spustenie
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B

COPY . .
RUN ./mvnw clean package -DskipTests

# 2️⃣ Druhý stage - Spustenie aplikácie
FROM amazoncorretto:17
WORKDIR /app

COPY --from=build /app/target/authorization-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]