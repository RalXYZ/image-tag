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

	{
		assignment := model.Assignment{}
		result := model.DB.Model(&assignment).Where("id = ?", assignmentIDUint64)

		if result.Error != nil {
			logrus.Error(result.Error)
			c.String(http.StatusInternalServerError, e.InternalServerError)
			return
		}

		if assignment.Status != uint64(model.CLAIMED) {
			c.String(http.StatusBadRequest, e.InvalidRequestBecauseOfCurrentState)
			return
		}
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

	{
		result := model.DB.Model(&model.Assignment{}).
			Where("id = ?", assignmentIDUint64).Update("status", model.SUBMITTED)

		if result.Error != nil {
			logrus.Error(result.Error)
			c.String(http.StatusInternalServerError, e.InternalServerError)
			return
		}
	}

	c.String(http.StatusCreated, "")
}
