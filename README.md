# Distributed File Orchestration And Synchronization

## Tech Stack Used:
- [Next.js](https://nextjs.org/): For Frontend Website UI
- [Go Fiber](https://docs.gofiber.io/): For HTTP Backend Server and Sockets
- [Apache Hadoop (HDFS)](https://hadoop.apache.org/): For fault tolerant and distributed storage
- [Go HDFS Client](https://pkg.go.dev/github.com/colinmarc/hdfs): Go HDFS Client
- [Air](https://pkg.go.dev/github.com/aofei/air): A live reload package for Go

For installing Hadoop refer [here](https://medium.com/@charan.n_22122016/installing-hadoop-on-ubuntu-a-step-by-step-guide-a2f43dfdc4ac).

## Getting Started:
- Install npm packages:
```
cd ./file-manager
npm i
```
- Start Hadoop:
```
start-all.sh
```
- Start Next.js server:
```
cd ./file-manager
npm run dev
```
- Start Go HTTP server:
```
./backend/bin/air
```
- For Deploying Next.js server into production:
```
cd ./file-manager
npm run build
npm start
```

## Contributors:
- J Yogesh: [Github Link](https://github.com/yogeshhsegoy)
- Pushkar S: [Github Link](https://github.com/S-Pushkar)
- Rahul Baradol: [Github Link](https://github.com/Rahul-Baradol)
- Sohan Shanbhag: [Github Link](https://github.com/sohanshanbhag1502)