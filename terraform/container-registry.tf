# Creates a container registry in Azure (to store Docker images)
# it will hold the docker images that we build and push from the github actions pipeline.

resource "azurerm_container_registry" "main" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  admin_enabled       = true
  sku                 = "Basic"
}
