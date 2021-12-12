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
		AllowCredentials: true,
		AllowOrigins:     []string{"http://127.0.0.1:8000", "http://localhost:8000"},
		AllowMethods:     []string{"POST", "GET", "PUT"},
	}))

	addRouter()

	log.Info("gin framework initialized")
}

func StartServer() {
	log.Fatal(r.Run(viper.GetString("gin.port")))
}
