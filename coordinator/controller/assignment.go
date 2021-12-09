package controller

import (
	e "coordinator/error"
	"coordinator/model"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
	"strconv"
)

func createAssignment(c *gin.Context) {
	requestID := c.Param("requestId")

	// convert requestID to uint64
	requestIDUint64, err := strconv.ParseUint(requestID, 10, 64)
	if err != nil {
		c.String(http.StatusBadRequest, e.InvalidRequestArgument)
		return
	}

	result := model.DB.Create(&model.Assignment{
		RequestID:  requestIDUint64,
		AssigneeID: c.GetString("username"),
	})

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.String(http.StatusCreated, "")
}

func getAssignmentByUser(c *gin.Context) {
	username := c.GetString("username")

	var assignments []model.Assignment
	result := model.DB.Preload("Request").Where("assignee_id = ?", username).Find(&assignments)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, assignments)
}
