package conf

import (
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

func Init() {
	viper.SetConfigName("conf")
	viper.AddConfigPath("./")
	if err := viper.ReadInConfig(); err != nil {
		log.Panic(err)
	}
}
