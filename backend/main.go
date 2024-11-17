package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/Cloud-Computing-Big-Data/RR-Team-10-distributed-file-orchestration-and-synchronization/crud"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey []byte = []byte(getEnv("JWT_KEY"))

func logger(message string, loglevel string) {
	file, err := os.OpenFile("app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Printf("Error opening log file: %v\n", err)
		return
	}
	defer file.Close()

	logger := log.New(file, "", log.LstdFlags)
	timestamp := time.Now().Format(time.RFC3339)
	logEntry := fmt.Sprintf("%s - [%s] - %s", timestamp, loglevel, message)
	logger.Println(logEntry)
}

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
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	password = string(hashedPassword)

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
		parts := strings.Split(line, ":")
		if len(parts) != 2 {
			continue
		}
		if parts[0] == username {
			err := bcrypt.CompareHashAndPassword([]byte(parts[1]), []byte(password))
			if err == nil {
				return true
			}
		}
	}
	return false
}

func signinHandler(c *fiber.Ctx) error {
	auth := c.Body()
	var data map[string]string = make(map[string]string);
	err := json.Unmarshal(auth, &data)
	if err != nil {
		c.Response().Header.Set("Content-Type", "application/json")
		c.Response().SetBody([]byte(`{"message": "Invalid JSON data"}`))
		return c.SendStatus(fiber.StatusBadRequest)
	}
	username, password := data["username"], data["password"]

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
			c.Response().Header.Set("Content-Type", "application/json")
			c.Response().SetBody([]byte(`{"message": "Internal Server Error"}`))
			return c.SendStatus(fiber.StatusInternalServerError)
		}

		logger(username+" signed in", "INFO")

		c.Response().Header.Set("Content-Type", "application/json")
		c.Response().SetBody([]byte(fmt.Sprintf(`{"username": "%s", "token":"%s"}`, username, 
		tokenString)))
		return c.SendStatus(200)
	} else {
		c.Response().Header.Set("Content-Type", "application/json")
		c.Response().SetBody([]byte(`{"message": "Either Username or Password is incorrect"}`))
		return c.SendStatus(fiber.StatusUnauthorized)
	}
}

func checkIfUserNameExists(username string) bool {
	data, err := os.ReadFile("id_passwd.txt")
	if err != nil {
		log.Printf("Error reading id_passwd.txt: %v\n", err)
		return false
	}
	credentials := strings.Split(string(data), "\n")
	for _, line := range credentials {
		if strings.Split(line, ":")[0] == username {
			return true
		}
	}
	return false
}

func signupHandler(c *fiber.Ctx) error {
	jsonData := c.Body()
	var data map[string]string = make(map[string]string);
	err := json.Unmarshal(jsonData, &data)
	if err != nil {
		c.Response().Header.Set("Content-Type", "application/json")
		c.Response().SetBody([]byte(`{"message": "Invalid JSON data"}`))
		return c.SendStatus(fiber.StatusBadRequest)
	}
	username, password := data["username"], data["password"]
	if checkIfUserNameExists(username) {
		c.Response().Header.Set("Content-Type", "application/json")
		c.Response().SetBody([]byte(`{"message": "User already exists"}`))
		return c.SendStatus(fiber.StatusConflict)
	}

	err = saveCredentials(username, password)
	if err != nil {
		c.Response().Header.Set("Content-Type", "application/json")
		c.Response().SetBody([]byte(`{"message": "Internal Server Error"}`))
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	logger(username+" signed up", "INFO")
	c.Response().Header.Set("Content-Type", "application/json")
	c.Response().SetBody([]byte(`{"message": "User created successfully"}`))
	return c.SendStatus(fiber.StatusCreated)
}

func websocketHandler(c *websocket.Conn) {
	username := c.Locals("username").(string)
	log.Printf("User %s connected via WebSocket", username)

	handleWebSocketConnection(c)
}

type WebSocketMessage struct {
	Operation string `json:"operation"`
	Filepath  string `json:"filepath"`
	Dirname   string `json:"dirname"`
	NewPath   string `json:"newPath"`
	Data      string `json:"data"` // Base64 encoded data for file contents
}

func handleWebSocketConnection(c *websocket.Conn) {
	defer c.Close()

	for {
		_, msg, err := c.ReadMessage()
		fmt.Println(msg)
		if err != nil {
			log.Println("read:", err)
			break
		}

		var request WebSocketMessage
		err = json.Unmarshal(msg, &request)
		if err != nil {
			log.Printf("Error parsing message: %v", err)
			c.WriteMessage(websocket.TextMessage, []byte("Error: Invalid message format"))
			continue
		}

		switch request.Operation {
		case "createFile":
			err = handleCreateFile(request, c)
		case "createFolder":
			err = handleCreateFolder(request, c)
		case "deleteFile":
			err = handleDeleteFile(request, c)
		case "deleteFolder":
			err = handleDeleteFolder(request, c)
		case "listFolderContents":
			err = handleListFolderContents(request, c)
		case "previewFile":
			err = handlePreviewFile(request, c)
		case "readFile":
			err = handleReadFile(request, c)
		case "renameFileOrFolder":
			err = handleRenameFileOrFolder(request, c)
		case "updateFile":
			err = handleUpdateFile(request, c)
		default:
			c.WriteMessage(websocket.TextMessage, []byte("Error: Unknown operation"))
			continue
		}

		if err != nil {
			log.Printf("Operation %s failed: %v", request.Operation, err)
			c.WriteMessage(websocket.TextMessage, []byte("Error: "+err.Error()))
		}
	}
}

// Helper functions for each CRUD operation

func handleCreateFile(request WebSocketMessage, c *websocket.Conn) error {
	data, err := base64.StdEncoding.DecodeString(request.Data)
	if err != nil {
		return err
	}
	err = crud.CreateFile(request.Filepath, data)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte("File created successfully"))
	}
	return err
}

func handleCreateFolder(request WebSocketMessage, c *websocket.Conn) error {
	err := crud.CreateFolder(request.Dirname)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte("Folder created successfully"))
	}
	return err
}

func handleDeleteFile(request WebSocketMessage, c *websocket.Conn) error {
	err := crud.DeleteFile(request.Filepath)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte("File deleted successfully"))
	}
	return err
}

func handleDeleteFolder(request WebSocketMessage, c *websocket.Conn) error {
	err := crud.DeleteFolder(request.Dirname)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte("Folder deleted successfully"))
	}
	return err
}

func handleListFolderContents(request WebSocketMessage, c *websocket.Conn) error {
	contents, err := crud.ListFolderContents(request.Dirname)
	if err == nil {
		response, _ := json.Marshal(contents)
		c.WriteMessage(websocket.TextMessage, response)
	}
	return err
}

func handlePreviewFile(request WebSocketMessage, c *websocket.Conn) error {
	data, err := crud.PreviewFile(request.Filepath)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte(base64.StdEncoding.EncodeToString(data)))
	}
	return err
}

func handleReadFile(request WebSocketMessage, c *websocket.Conn) error {
	data, err := crud.ReadFile(request.Filepath)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte(base64.StdEncoding.EncodeToString(data)))
	}
	return err
}

func handleRenameFileOrFolder(request WebSocketMessage, c *websocket.Conn) error {
	err := crud.RenameFileOrFolder(request.Filepath, request.NewPath)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte("File or folder renamed successfully"))
	}
	return err
}

func handleUpdateFile(request WebSocketMessage, c *websocket.Conn) error {
	data, err := base64.StdEncoding.DecodeString(request.Data)
	if err != nil {
		return err
	}
	err = crud.UpdateFile(request.Filepath, data)
	if err == nil {
		c.WriteMessage(websocket.TextMessage, []byte("File updated successfully"))
	}
	return err
}

func checkLoggedIn(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	tokenString := strings.Split(auth, " ")[1]
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	username := claims.Username
	if !checkIfUserNameExists(username) {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	c.Response().Header.Set("Content-Type", "application/json")
	c.Response().SetBody([]byte(fmt.Sprintf(`{"username": "%s"}`, username)))
	return c.SendStatus(200)
}

func main() {
	app := fiber.New()

	// Example usage of the CreateFile and DeleteFile functions
	err := crud.CreateFile("/test.txt", []byte("Hello, World!"))

	err = crud.DeleteFile("/test.txt")

	if err != nil {
		log.Fatalf("Error uploading file: %v\n", err)
	}

	app.Post("/auth/signin", signinHandler)

	app.Get("/ws", func(c *fiber.Ctx) error {
		tokenString := c.Query("auth-token", "")
		fmt.Println(tokenString)
		if tokenString == "" {
			return c.SendStatus(fiber.StatusUnauthorized)
		}
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		c.Locals("username", claims.Username)
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return c.SendStatus(fiber.StatusUpgradeRequired)
	}, websocket.New(websocketHandler))

	app.Post("/auth/signup", signupHandler)

	app.Get("/auth/loggedIn", checkLoggedIn)

	log.Fatal(app.Listen(":8080"))
}
