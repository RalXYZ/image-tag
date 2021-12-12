package model

import "time"

type Assignment struct {
	ID         uint64
	RequestID  uint64
	Request    Request `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	AssigneeID string
	Assignee   User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Status     uint64    `gorm:"not null;default:0"` // 0: claimed, 1: annotation submitted, 2: accepted, 3: rejected
	CreatedAt  time.Time `gorm:"not null"`
	UpdatedAt  time.Time `gorm:"not null"`
}
