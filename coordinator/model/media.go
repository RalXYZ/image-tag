package model

import "github.com/gofrs/uuid"

type Media struct {
    ID         int64
    Name       string    `gorm:"not null"`
    UploaderID string    `gorm:"size:32"`
    Uploader   User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
    UUID       uuid.UUID `gorm:"not null;uniqueIndex;size:36"`
    Finished   bool      `gorm:"not null;default:false;"`
}