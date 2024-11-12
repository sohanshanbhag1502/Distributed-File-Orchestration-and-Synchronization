package crud

import (
	"github.com/colinmarc/hdfs"
	"fmt"
)

func DeleteFolder(dirname string) error {
	if dirname == "" {
		return fmt.Errorf("Empty dirname")
	}
	
	client, err := hdfs.New("localhost:9000")
	if err != nil {
		return err
	}
	defer client.Close()

	err = client.Remove(dirname)
	return err
}