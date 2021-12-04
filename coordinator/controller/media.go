package controller

import (
	"coordinator/error"
	"coordinator/model"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/sirupsen/logrus"
	"net/http"
	"time"
)

type PresignedPost struct {
	Url    string            `json:"url"`
	UUID   string            `json:"uuid"`
	Policy map[string]string `json:"policy"`
}

func createMedia(c *gin.Context) {
	name := c.PostForm("name")
	if name == "" {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
    }

	policy := minio.NewPostPolicy()
	uuid, err := uuid.NewV4()
	if err != nil {
        logrus.Error(err)
        c.String(http.StatusInternalServerError, error.InternalServerError)
        return
    }
	_ = policy.SetBucket(model.BucketName)
	_ = policy.SetKey(uuid.String())
	_ = policy.SetExpires(time.Now().UTC().Add(time.Minute * 15))
	_ = policy.SetContentLengthRange(0, 10*1024*1024) // up to 10 MiB
	url, formData, err := model.MC.PresignedPostPolicy(c, policy)
	if err != nil {
		logrus.Error(err)
		return
	}
	result := model.DB.Create(&model.Media{
		UUID: uuid,
		Name: name,
		UploaderID: c.GetString("username"),
	})

	if result.Error != nil {
		logrus.Error(err)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, & PresignedPost{
		Url:    url.String(),
		Policy: formData,
		UUID:   uuid.String(),
	})

	return
}

func getMediaById(c *gin.Context) {
	id := c.Param("uuid")
	media := model.Media{}
	result := model.DB.Where("uuid = ?", id).First(&media)
	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}
	c.JSON(http.StatusOK, &media)
}

func getMediaByUser(c *gin.Context) {
	user := c.Param("username")
	var media []model.Media
	result := model.DB.Where("uploader_id = ?", user).Find(&media)
	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}
	c.JSON(http.StatusOK, &media)
}

func sealMedia(c *gin.Context) {
	uuid := c.PostForm("uuid")
	if uuid == "" {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
	}

	result := model.DB.Model(&model.Media{}).Where("uuid = ?", uuid).Update("finished", true)
	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	c.String(http.StatusOK, "")
	return
}
