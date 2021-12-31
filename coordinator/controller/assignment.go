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
	result := model.DB.
		Preload("Request").
		Select("id", "request_id", "assignee_id", "status", "created_at", "updated_at").
		Where("assignee_id = ?", username).Find(&assignments)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, assignments)
}

func getAssignmentById(c *gin.Context) {
	id := c.Param("id")

	var assignment model.Assignment
	result := model.DB.Where("id = ?", id).First(&assignment)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, assignment)
}

func getReviewByReviewer(c *gin.Context) {
	username := c.GetString("username")

	var assignments []model.Assignment
	subQuery := model.DB.Select("id").Table("requests").Where("uploader_id = ?", username)
	result := model.DB.
		Select("id", "request_id", "assignee_id", "status", "created_at", "updated_at").
		Where("request_id IN (?)", subQuery).Find(&assignments)
	// SELECT * FROM assignments WHERE request_id IN (SELECT id FROM requests WHERE uploader_id = 'foo');

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, assignments)
}

func reviewAssignment(c *gin.Context) {
	assignmentID := c.PostForm("assignmentID")
	newState := c.PostForm("newState")

	if newState != strconv.Itoa(int(model.ACCEPTED)) && newState != strconv.Itoa(int(model.REJECTED)) {
		c.String(http.StatusBadRequest, e.InvalidRequestArgument)
		return
	}

	// convert assignmentID to uint64
	assignmentIDUint64, err := strconv.ParseUint(assignmentID, 10, 64)
	if err != nil {
		c.String(http.StatusBadRequest, e.InvalidRequestArgument)
		return
	}

	assignment := model.Assignment{}
	result := model.DB.Where("id = ?", assignmentID).Find(&assignment)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	if assignment.Status != uint64(model.SUBMITTED) {
		c.String(http.StatusBadRequest, e.InvalidRequestBecauseOfCurrentState)
		return
	}

	result = model.DB.Model(&model.Assignment{}).
		Where("id = ?", assignmentIDUint64).Update("status", newState)

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.String(http.StatusResetContent, "")
}

func createAnnotation(c *gin.Context) {
	result := c.PostForm("result")
	assignmentID := c.PostForm("assignmentID")

	if result == "" || assignmentID == "" {
		c.JSON(http.StatusBadRequest, e.InvalidRequestArgument)
		return
	}

	{
		assignment := model.Assignment{}
		result := model.DB.First(&assignment, assignmentID)

		if result.Error != nil {
			logrus.Error(result.Error)
			c.String(http.StatusInternalServerError, e.InternalServerError)
			return
		}

		if assignment.Status != uint64(model.CLAIMED) && assignment.Status != uint64(model.REJECTED) {
			c.String(http.StatusBadRequest, e.InvalidRequestBecauseOfCurrentState)
			return
		}
	}

	{
		result := model.DB.Model(&model.Assignment{}).
			Where("id = ?", assignmentID).Updates(
			model.Assignment{Status: uint64(model.SUBMITTED), Result: result})

		if result.Error != nil {
			logrus.Error(result.Error)
			c.String(http.StatusInternalServerError, e.InternalServerError)
			return
		}
	}

	c.String(http.StatusCreated, "")
}
