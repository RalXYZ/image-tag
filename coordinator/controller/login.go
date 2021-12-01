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
)

func register(c *gin.Context) {
	username, ok1 := c.GetPostForm("username")
	password, ok2 := c.GetPostForm("password")
	email, ok3 := c.GetPostForm("email")
	if !(ok1 && ok2 && ok3) {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
	}
	passwordHashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Error(err)
		c.String(http.StatusInternalServerError, "")
		return
	}
	if model.DB.Create(&model.User {
		Username: username,
		Password: passwordHashed,
		Email: email,
		SessionId: uuid.NullUUID{}.UUID,  // FIXME: maybe a bug
	}).Error != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	c.String(http.StatusOK, "")
}

func login(c *gin.Context) {
	username, ok1 := c.GetPostForm("username")
	password, ok2 := c.GetPostForm("password")

	if !(ok1 && ok2) {
		c.String(http.StatusBadRequest, error.RequiredFieldMissing)
		return
	}

	user := model.User{}
	if model.DB.First(&user, username).Error == gorm.ErrRecordNotFound {
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
		c.String(http.StatusInternalServerError, "")
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
