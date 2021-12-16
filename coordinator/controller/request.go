package controller

import (
	e "coordinator/error"
	"coordinator/model"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
)

// this method shall be called first at the start of each annotation request creation transaction
func createRequest(c *gin.Context) {
	name := c.PostForm("name")
	tags := c.PostForm("tags")
	if name == "" || tags == "" {
		c.String(http.StatusBadRequest, e.RequiredFieldMissing)
		return
	}

	request := model.Request{
		Name:       name,
		Tags:       tags,
		UploaderID: c.GetString("username"),
	}

	result := model.DB.Create(&request)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusCreated, request.ID)
}

func sealRequest(c *gin.Context) {
	id := c.PostForm("requestId")
	if id == "" {
		c.String(http.StatusBadRequest, e.RequiredFieldMissing)
		return
	}

	request := model.Request{}
	result := model.DB.First(&request, id)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	if request.UploadFinished {
		c.String(http.StatusBadRequest, e.RequestAlreadyFinished)
		return
	}

	request.UploadFinished = true
	result = model.DB.Save(&request)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.String(http.StatusNoContent, "")
}

func getRequestByUser(c *gin.Context) {
	var requests []model.Request

	fmt.Println(c.GetString("username"))

	result := model.DB.
		Where("uploader_id = ? AND upload_finished = 1", c.GetString("username")).
		Find(&requests)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, requests)
}

func getRequest(c *gin.Context) {
	var request []model.Request

	result := model.DB.
		Where("upload_finished = 1").
		Find(&request)
	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, request)
}

func getRequestByRequestId(c *gin.Context) {
	id := c.Param("id")

	request := model.Request{}
	result := model.DB.First(&request, id)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, request)
}
