package controller

import (
	"coordinator/error"
	"coordinator/model"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
)

// this method shall be called first at the start of each annotation request creation transaction
func createRequest(c *gin.Context) {
	name := c.PostForm("name")
	if name == "" {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
	}

	request := model.Request{
		Name:       name,
		UploaderID: c.GetString("username"),
	}

	result := model.DB.Create(&request)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, request.ID)
}

func sealRequest(c *gin.Context) {
	id := c.PostForm("requestId")
	if id == "" {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
	}

	request := model.Request{}
	result := model.DB.First(&request, id)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	if request.UploadFinished {
		c.String(http.StatusBadRequest, error.RequestAlreadyFinished)
		return
	}

	request.UploadFinished = true
	result = model.DB.Save(&request)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	c.String(http.StatusOK, "")
}

func getRequestByUser(c *gin.Context) {
	var requests []model.Request

	fmt.Println(c.GetString("username"))

	result := model.DB.
		Where("uploader_id = ? AND upload_finished = 1", c.GetString("username")).
		Find(&requests)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, requests)
}