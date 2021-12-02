package controller

import "coordinator/middleware"

func addRouter() {
	user := r.Group("user")

	user.GET("", getLoginStatus, middleware.Authenticate())
	user.POST("", register)
	user.POST("login", login)
}
