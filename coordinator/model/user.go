package model

import (
	"github.com/gofrs/uuid"
	"time"
)

type User struct {
	Username  string    `gorm:"primaryKey;size:32"`
	Name      string    `gorm:"not null;size:32"`
	Password  []byte    `gorm:"not null;size:72"`
	Email     string    `gorm:"not null;uniqueIndex;size:32"`
	SessionId uuid.UUID `gorm:"not null;uniqueIndex;size:36"`
	UpdatedAt time.Time `gorm:"not null"`
}
