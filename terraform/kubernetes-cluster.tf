resource "azurerm_kubernetes_cluster" "main" {
  name                = var.app_name
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = var.app_name

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_DS2_v2"
}

identity {
    type = "SystemAssigned"
  }
}


/*
resource "azurerm_kubernetes_cluster_acr" "main" {
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  acr_name              = azurerm_container_registry.main.name
}
*/