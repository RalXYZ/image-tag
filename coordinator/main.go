package main

import (
	"coordinator/conf"
	"coordinator/controller"
	"coordinator/model"
)

func main() {
	conf.Init()
	model.Init()
	model.ConnectObjectStorage()
	controller.InitWebFramework()
	controller.StartServer()
}
