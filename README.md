# Booc
In this fork we will migrate Booc to the cloud!  

Booc is an event scheduling app. 
By adding friends and joining groups you can invite others to your events. Keep track of everything on your personal page.


Group 3 - List of members
---------
Github handle - Firstname Lastname

* darii99 - Darina Larsen
* sodqv - Sara Odqvist



Tools
----------
[Material UI Components](https://mui.com/material-ui/all-components)


Starting app on client
---------
1. Clone repository.
2. Go into "frontend" folder.
3. Open cmd (in the current directory) and enter ```npm ci``` (this requires node.js).
4. Enter ```npm start``` in cmd.

Starting backend server
---------
1. Clone repository
2. Go into "backend" folder.
3. Open cmd in current directory and enter ```npm ci``` (this requires node.js).
4. Create a .env file (currently you need one .env in the backend directory, one in backend/Microservices/Events and one in backend/Microservices/Groups).
5. Enter your username and password for the mongodb connection string in the .env file. The format should be:
```
DB_USERNAME=[place username here]  
DB_PASSWORD=[place password here] 
SESSION_SECRET=[place your session secret here]
```

- If you want to connect to a database other than the one setup by us, then change the following in backend:  
    - In app.js change line 49 to your connection string  (uri:)  
    - In ./model/mongodbStarter.js change line 9 and 12 to your connection string  
    - Observe that this connection string should preferably set its user with process.env.DB_USERNAME, and process.env.DB_PASSWORD to avoid leaking the connection string.  
    - The connection string also decides which database in the cluster is used to so set it to an appropriate name. (This is the /Booc? part of the connection string where booc is the database name).  

6. For debugging run ```SET DEBUG=backend:* & npm start``` in the cmd (this has a problem with doing it in vscode) or if you are running it for production ```npm start```.
   

Starting gateway
---------
1. Clone repository
2. Open "backend" in cmd
4. Run ```node gateway.js```


Starting microservices
---------
1. Clone repository
2. Open "backend/Microservices/Users" in cmd
3. Run ```npm ci```
4. Run ```node userService.js```


Do the same for the other microservices.    
"backend/Microservices/Events" ```node eventService.js```  
"backend/Microsevices/Groups" ```node groupService.js```  

Starting microservices using Docker
---------
1. Install [Docker](https://www.docker.com) on your computer 
2. Open Booc_2.0/backend in cmd

### User Microservice
1. Build the Docker Image ```docker build -t user_service:latest -f Microservices/Users/Dockerfile . --no-cache```
2. Run the Docker Container ```docker run -d -p 3200:3200 --name user_service user_service:latest```
3. Check that the container is running ```docker ps```

### Event Microservice
1. Build the Docker Image ```docker build -t event_service:latest -f Microservices/Events/Dockerfile . --no-cache```
2. Run the Docker Container ```docker run -d -p 3400:3400 --name event_service event_service:latest```
3. Check that the container is running ```docker ps```

### Group Microservice
1. Build the Docker Image ```docker build -t group_service:latest -f Microservices/Groups/Dockerfile . --no-cache```
2. Run the Docker Container ```docker run -d -p 3600:3600 --name group_service group_service:latest```
3. Check that the container is running ```docker ps```


Terraform Setup Guide
----------
1. ### Install Terraform
    - Windows: <br>
       - Download Terraform from the official site: https://developer.hashicorp.com/terraform/downloads <br>
       - Add Terraform to your system's PATH: *Open "Environment Variables" > Edit "System Variables" > Add the Terraform folder to Path.* <br>
       - Verify installation by writing ``` terraform -v ``` in the cmd.
     
    - Linux (Ubuntu/Debian): <br>
        ```
        sudo apt update && sudo apt install -y gnupg software-properties-common
        wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
        sudo apt update && sudo apt install terraform -y
        terraform -v
        ```
    - MacOS (Homebrew)
        ```
        brew tap hashicorp/tap
        brew install hashicorp/tap/terraform
        terraform -v
        ```

2. ### Initialize Terraform for this Project
   - Authenticate with Azure (if using Azure Resources) in cmd: ``` az login ```
   - Navigate to your Terraform Project Directory : ``` cd path/to/your/terraform/project ```
   - Initialize Terraform in cmd: ``` terraform init ```
   - Check Terraform configuration:  ``` terraform validate ```
   - Apply Change to Deploy Resources: ``` terraform apply ``` and type "yes" when prompted to confirm.
   - Do not forget to add sensitive files (such as terraform.tfstate) in .gitignore
  
3. ### Troubleshooting
 - If Terraform fails due to an existing resource, you need to import it:
    ```
     terraform import <resource_type>.<resource_name> <resource_id>
      ```
   For example:
   ```
   terraform import azurerm_resource_group.main "/subscriptions/xxxx/resourceGroups/your-rg"
   ```
- Ensure that your backend block is properly defined in terraform.tf or main.tf
- Reinitialize Terraform to download the necessary plugins: ``` terraform init -upgrade ```
- If you want to remove all created resources, run: ``` terraform destroy ```

List of Features
----------
- user accounts
- security (password encryption)
- create and join events
- create and join groups
- add friends
- personal page with your scheduled events
- change password

Main Entities
----------
Users, Events, Groups

