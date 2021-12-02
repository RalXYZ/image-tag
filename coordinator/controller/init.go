package controller

import (
	"github.com/gin-contrib/cors"
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

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "GET"},
	}))

	addRouter()

	log.Info("gin framework initialized")
}

func StartServer() {
	log.Fatal(r.Run(viper.GetString("gin.port")))
}
