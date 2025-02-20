# creates an Azure Kubernetes Service (AKS) cluster, which will run our microservices.
# Our docker containers will be deployed and managed here.


resource "azurerm_kubernetes_cluster" "main" {
  name                = var.app_name
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = var.app_name
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_DS2_v2"
}

identity {
    type = "SystemAssigned"
  }
}



resource "azurerm_role_assignment" "main" {
  principal_id                     = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.main.id
  skip_service_principal_aad_check = true
}


