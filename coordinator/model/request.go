package model

import "time"

type Request struct {
	ID             uint64
	Name           string    `gorm:"not null"`
	Tags           string    `gorm:"not null"`
	UploaderID     string    `gorm:"size:32"`
	Uploader       User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	UploadFinished bool      `gorm:"not null;default:false;"`
	CreatedAt      time.Time `gorm:"not null"`
	UpdatedAt      time.Time `gorm:"not null"`
}
