package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

var jwtKey []byte = []byte(getEnv("JWT_KEY"))

func getEnv(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	return os.Getenv(key)
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func saveCredentials(username, password string) error {
	entry := fmt.Sprintf("%s:%s\n", username, password)
	file, err := os.OpenFile("id_passwd.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()
	_, err = file.WriteString(entry)
	return err
}

func validateCredentials(username, password string) bool {
	data, err := os.ReadFile("id_passwd.txt")
	if err != nil {
		log.Printf("Error reading id_passwd.txt: %v\n", err)
		return false
	}
	credentials := strings.Split(string(data), "\n")
	for _, line := range credentials {
		if line == fmt.Sprintf("%s:%s", username, password) {
			return true
		}
	}
	return false
}

func authHandler(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" || !strings.HasPrefix(auth, "Basic ") {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	payload, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(auth, "Basic "))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid Authorization Header")
	}
	credentials := strings.SplitN(string(payload), ":", 2)
	if len(credentials) != 2 {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid Authorization Format")
	}
	username, password := credentials[0], credentials[1]

	if validateCredentials(username, password) {
		expirationTime := time.Now().Add(1 * time.Hour)
		claims := &Claims{
			Username: username,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
		}

		return c.JSON(fiber.Map{"token": tokenString})
	} else {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}
}

func main() {
	app := fiber.New()

	app.Get("/auth/signin", authHandler)

	log.Fatal(app.Listen(":8080"))
}
