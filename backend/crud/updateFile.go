package crud

import (
	"github.com/colinmarc/hdfs"
	"fmt"
)

func UpdateFile(filepath string, data []byte) error {
	if filepath == "" {
		return fmt.Errorf("Empty filepath")
	}
	
	client, err := hdfs.New("localhost:9000")
	if err != nil {
		return err
	}
	defer client.Close()

	DeleteFile(filepath)

	file, err := client.Create(filepath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(data)
	return err
}