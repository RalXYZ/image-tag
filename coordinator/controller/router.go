package controller

import "coordinator/middleware"

func addRouter() {
	user := r.Group("user")

	user.GET("", getLoginStatus, middleware.Authenticate())
	user.POST("", register)
	user.POST("login", login)

	media := r.Group("media")
	media.GET("", getMediaByUser)
	media.GET("/:uuid", getMediaById)
	media.POST("", createMedia)
	media.POST("seal", sealMedia)

}
