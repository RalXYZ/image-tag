package model

type Request struct {
	ID             uint64
	Name           string `gorm:"not null"`
	UploaderID     string `gorm:"size:32"`
	Uploader       User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	UploadFinished bool   `gorm:"not null;default:false;"`
}
