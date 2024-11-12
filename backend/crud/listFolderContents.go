package crud

import (
	"github.com/colinmarc/hdfs"
	"fmt"
)

func ListFolderContents(folderpath string) ([]string, error) {
	if folderpath == "" {
		return nil, fmt.Errorf("Empty folderpath")
	}

	client, err := hdfs.New("localhost:9000")
	if err != nil {
		return nil, err
	}
	defer client.Close()

	files, err := client.ReadDir(folderpath)
	if err != nil {
		return nil, err
	}

	var filenames []string = make([]string, len(files))

	for i, file := range files {
		if file.IsDir() {
			filenames[i] = file.Name() + "/"
		} else {
			filenames[i] = file.Name()
		}
	}

	return filenames, nil
}