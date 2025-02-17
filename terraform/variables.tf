variable "app_name" {
  default = "booc2"
}

variable "location" {
  type        = string
  default     = "swedencentral"
  description = "Location of the resource group."
}

variable "kubernetes_version" {
  default = "1.32.2"
}

output "app_name" {
  value = var.app_name
}