package crud

import (
	"github.com/colinmarc/hdfs"
	"fmt"
)

func DeleteFile(filepath string) error {
	if filepath == "" {
		return fmt.Errorf("Empty filepath")
	}
	client, err := hdfs.New("localhost:9000")
	if err != nil {
		return err
	}
	defer client.Close()

	err = client.Remove(filepath)
	return err
}