package controller

import "coordinator/middleware"

func addRouter() {
	user := r.Group("user")
	user.GET("", getLoginStatus, middleware.Authenticate())
	user.POST("", register)
	user.POST("login", login)

	media := r.Group("media", middleware.Authenticate())
	media.GET("", getMediaByUser)
	media.GET("/:uuid", getMediaById)
	media.POST("", createMedia)
	media.POST("seal", sealMedia)
	media.GET("request/:requestId", getAllImagesByRequest)

	request := r.Group("request", middleware.Authenticate())
	request.POST("", createRequest)
	request.POST("seal", sealRequest)
	request.GET("", getRequestByUser)
}
