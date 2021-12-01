package model

import "github.com/gofrs/uuid"

type User struct {
	Username  string    `gorm:"primaryKey"`
	Password  []byte    `gorm:"not null;size:72"`
	Email     string    `gorm:"not null;uniqueIndex;size:32"`
	SessionId uuid.UUID `gorm:"not null;uniqueIndex;size:36"`
}
