package crud

import (
	"github.com/colinmarc/hdfs"
    "fmt"
)

func PreviewFile(filepath string) ([]byte, error) {
    if filepath == "" {
        return nil, fmt.Errorf("Empty filepath")
    }

    client, err := hdfs.New("localhost:9000")
    if err != nil {
        return nil, err
    }
    defer client.Close()

    file, err := client.Open(filepath)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    // read 1024 bytes from the file
    data := make([]byte, 1024)
    _, err = file.Read(data)
    if err != nil {
        return nil, err
    }

    return data, nil
}
