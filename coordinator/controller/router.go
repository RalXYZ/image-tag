package controller

func addRouter() {
	user := r.Group("user")

	user.POST("", register)
	user.POST("login", login)
}
