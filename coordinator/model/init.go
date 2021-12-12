package model

import (
	"context"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB
var MC *minio.Client
var BucketName string

func Init() {
	connectDatabase()
	migrate()
}

func connectDatabase() {
	loginInfo := viper.GetStringMapString("sql")

	dbArgs := loginInfo["username"] + ":" + loginInfo["password"] +
		"@(localhost)/" + loginInfo["db_name"] + "?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open(mysql.Open(dbArgs), &gorm.Config{})
	if err != nil {
		logrus.Panic(err)
	}
}

func migrate() {
	err := DB.AutoMigrate(&User{}, &Request{}, &Media{}, &Assignment{}, &Annotation{})
	if err != nil {
		log.Fatal(err)
	}
}

func ConnectObjectStorage() {
	BucketName = viper.GetString("minio.bucket_name")

	var err error
	MC, err = minio.New(viper.GetString("minio.endpoint"), &minio.Options{
		Creds:  credentials.NewStaticV4(viper.GetString("minio.id"), viper.GetString("minio.secret"), ""),
		Secure: viper.GetBool("minio.secure"),
	})
	if err != nil {
		panic(err)
	}
	_, err = MC.ListBuckets(context.Background())
	if err != nil {
		logrus.Fatal(err)
	}

	err = createBuckets(BucketName)
	if err != nil {
		logrus.Fatal(err)
	}

	logrus.Info("MinIO connected")
}

func createBuckets(name string) error {
	if ok, err := MC.BucketExists(context.Background(), name); ok {
		return nil
	} else if err != nil {
		return err
	}

	err := MC.MakeBucket(context.Background(), name, minio.MakeBucketOptions{})
	if err != nil {
		return err
	}

	return nil
}
