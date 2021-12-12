package model

import (
	"github.com/gofrs/uuid"
	"time"
)

type Media struct {
	ID         uuid.UUID `gorm:"size:36"`
	UploaderID string    `gorm:"size:32"`
	Uploader   User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	RequestID  uint64
	Request    Request   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Finished   bool      `gorm:"not null;default:false;"`
	CreatedAt  time.Time `gorm:"not null"`
}
