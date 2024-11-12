package crud

import (
	"github.com/colinmarc/hdfs"
	"fmt"
)

func RenameFileOrFolder(oldPath, newPath string) error {
	if oldPath == "" || newPath == "" {
		return fmt.Errorf("Empty filepath")
	}

	client, err := hdfs.New("localhost:9000")
	if err != nil {
		return err
	}
	defer client.Close()

	err = client.Rename(oldPath, newPath)
	return err
}