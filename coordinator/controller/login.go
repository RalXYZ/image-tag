package controller

import (
	"coordinator/error"
	"coordinator/model"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"regexp"
)

func getLoginStatus(c *gin.Context) {
	if username := c.GetString("username"); username != "" {
		c.String(http.StatusOK, username)
	} else {
		c.String(http.StatusNotFound, "")
	}
}

func register(c *gin.Context) {
	name := c.PostForm("name")
	username := c.PostForm("username")
	password := c.PostForm("password")
	email := c.PostForm("email")

	if username == "" || password == "" || email == "" || name == "" {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
	}
	if len(password) <= 6 || len(username) <= 6 {
		c.String(http.StatusBadRequest, error.InvalidRequestArgument)
		return
	}

	r, _ := regexp.Compile("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")
	if !r.MatchString(email) {
		c.String(http.StatusBadRequest, error.InvalidRequestArgument)
		return
	}

	passwordHashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Error(err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	if model.DB.Create(&model.User{
		Name:      name,
		Username:  username,
		Password:  passwordHashed,
		Email:     email,
		SessionId: uuid.NullUUID{}.UUID, // FIXME: maybe a bug
	}).Error != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	c.String(http.StatusCreated, "")
}

func login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	if username == "" || password == "" {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
	}

	user := model.User{Username: username}
	if model.DB.First(&user).Error == gorm.ErrRecordNotFound {
		c.String(http.StatusNotFound, error.UserNotFound)
		return
	}

	if bcrypt.CompareHashAndPassword(user.Password, []byte(password)) != nil {
		c.String(http.StatusForbidden, error.WrongPassword)
		return
	}

	sessionID, err := uuid.NewV4()
	if err != nil {
		log.Error(err)
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	user.SessionId = sessionID
	model.DB.Save(&user)

	c.SetCookie(
		viper.GetString("token.name"),
		sessionID.String(),
		viper.GetInt("token.max_age"),
		"/",
		viper.GetString("token.domain"),
		viper.GetBool("token.secure"),
		viper.GetBool("token.http_only"),
	)

	c.String(http.StatusOK, "")
	return
}

func logout(c *gin.Context) {
	username := c.GetString("username")
	if err := model.DB.Model(&model.User{}).
		Where("username = ?", username).
		Update("session_id", "00000000-0000-0000-0000-000000000000").Error; err != nil {
		c.String(http.StatusInternalServerError, error.InternalServerError)
		return
	}

	c.String(http.StatusResetContent, "")
	return
}
