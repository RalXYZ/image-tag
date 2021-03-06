package middleware

import (
	"coordinator/error"
	"coordinator/model"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/spf13/viper"
	"gorm.io/gorm"
	"net/http"
)

func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		str, err := c.Cookie(viper.GetString("token.name"))
		if err != nil {
			c.String(http.StatusUnauthorized, "")
			c.Abort()
			return
		}
		uuidUser, err := uuid.FromString(str)
		if err != nil {
			c.String(http.StatusUnauthorized, "")
			c.Abort()
			return
		}

		user := model.User{SessionId: uuidUser}
		if err = model.DB.Where(&user).First(&user).Error; err == gorm.ErrRecordNotFound {
			c.String(http.StatusInternalServerError, "")
			c.Abort()
			return
		} else if err != nil {
			c.String(http.StatusUnauthorized, error.InvalidToken)
			c.Abort()
			return
		}

		c.Set("username", user.Username)
		c.Next()
	}
}
