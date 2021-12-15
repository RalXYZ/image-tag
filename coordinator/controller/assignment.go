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

func getReviewByReviewer(c *gin.Context) {
	username := c.GetString("username")

	var assignments []model.Assignment
	subQuery := model.DB.Select("id").Table("requests").Where("uploader_id = ?", username)
	result := model.DB.Where("request_id IN (?)", subQuery).Find(&assignments)
	// SELECT * FROM assignments WHERE request_id IN (SELECT id FROM requests WHERE uploader_id = 'foo');

	if result.Error != nil {
		logrus.Error(result.Error)
		c.String(http.StatusInternalServerError, e.InternalServerError)
		return
	}

	c.JSON(http.StatusOK, assignments)
}

func reviewAssignment(c *gin.Context) {
	assignmentID := c.Param("assignmentId")
	newState := c.Param("newState")

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
	result := model.DB.Model(&assignment).Where("id = ?", assignmentIDUint64)

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
