package main

import (
	"coordinator/conf"
	"coordinator/controller"
	"coordinator/model"
)

func main() {
	conf.Init()
	model.Init()
	controller.InitWebFramework()
	controller.StartServer()
}
