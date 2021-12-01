package controller

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

var r *gin.Engine

func InitWebFramework() {
	if viper.GetBool("gin.release") {
		gin.SetMode(gin.ReleaseMode)
	}
	r = gin.Default()
	addRouter()

	log.Info("gin framework initialized")
}

func StartServer() {
	log.Fatal(r.Run(viper.GetString("gin.port")))
}
