resource "azurerm_resource_group" "main" {
        name = var.app_name
        location = var.location
}
