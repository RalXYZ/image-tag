package controller

import "coordinator/middleware"

func addRouter() {
	api := r.Group("api")

	user := api.Group("user")
	user.POST("", register)
	user.POST("login", login)
	user.POST("logout", middleware.Authenticate(), logout)
	user.GET("", middleware.Authenticate(), getLoginStatus)

	media := api.Group("media", middleware.Authenticate())
	media.GET("", getMediaByUser)
	media.GET("/:uuid", getMediaById)
	media.POST("", createMedia)
	media.PUT("seal", sealMedia)
	media.GET("request/:requestId", getAllImagesByRequest)

	request := api.Group("request", middleware.Authenticate())
	request.POST("", createRequest)
	request.PUT("seal", sealRequest)
	request.GET("my", getRequestByUser)
	request.GET("", getRequest)
	request.GET("id/:id", getRequestByRequestId)

	assignment := api.Group("assignment", middleware.Authenticate())
	assignment.POST("request/:requestId", createAssignment)
	assignment.GET("", getAssignmentByUser)
	assignment.GET("review", getReviewByReviewer)
	assignment.GET("review/:id", getAssignmentById)
	assignment.PUT("review", reviewAssignment)
	assignment.PUT("annotation", createAnnotation)
}
