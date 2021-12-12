package model

import "time"

type Annotation struct {
	ID           uint64
	MediaID      string
	Media        Media `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	AssignmentID uint64
	Assignment   Assignment `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Result       string     `gorm:"not null"`
	CreatedAt    time.Time  `gorm:"not null"`
}
