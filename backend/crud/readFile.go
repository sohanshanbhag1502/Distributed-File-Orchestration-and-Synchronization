package crud

import (
	"fmt"
	"io"

	"github.com/colinmarc/hdfs"
)

func ReadFile(filepath string) ([]byte, error) {
	if filepath == "" {
		return nil, fmt.Errorf("Empty filepath")
	}

	// Create HDFS client
	client, err := hdfs.New("localhost:9000")
	if err != nil {
		return nil, fmt.Errorf("Failed to create HDFS client: %w", err)
	}
	defer client.Close()

	// Open the file
	file, err := client.Open(filepath)
	if err != nil {
		return nil, fmt.Errorf("Failed to open file: %w", err)
	}
	defer file.Close()

	// Read the file content
	data, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("Failed to read file content: %w", err)
	}

	return data, nil
}
