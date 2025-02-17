# Create a storage container in Azure (for Blobs, i.e. arbitrary files)

resource "azurerm_storage_container" "main" {
  name                  = "images"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}