# defines the required Terraform provider (AzureRM) to interact with azure.

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.117.0"


    }
  }
  
  required_version = "= 1.10.5"
}

provider "azurerm" {
  features {}
}
