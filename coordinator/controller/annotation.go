package controller

import (
	e "coordinator/error"
	"coordinator/model"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
	"strconv"
)

func createAnnotation(c *gin.Context) {
	uuid := c.PostForm("uuid")
	result := c.PostForm("result")
	assignmentID := c.PostForm("assignmentID")
	if uuid == "" || result == "" || assignmentID == "" {
		c.JSON(http.StatusBadRequest, e.InvalidRequestArgument)
		return
	}

	assignmentIDUint64, err := strconv.ParseUint(assignmentID, 10, 64)
	if err != nil {
		c.String(http.StatusBadRequest, e.InvalidRequestArgument)
		return
	}

	res := model.DB.Create(&model.Annotation{
		MediaID:      uuid,
		AssignmentID: assignmentIDUint64,
		Result:       result,
	})

	if res.Error != nil {
		logrus.Error(res.Error)
		c.JSON(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.String(http.StatusCreated, "")
}
