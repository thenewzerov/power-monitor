# Enphase Monitor

This application will poll an Enphase Controller ever second and display the results.
It's run through a simple Nginx Docker Container

## Installation

### Clone the repository
```bash
git clone 
```

### Update the ip in the nginx.conf file

Inside the `nginx.conf` file, replace  `{enphase_controller_ip}` to the ip address of the Enphase Controller


### Build the Docker image
```bash
docker build -t enphase-monitor .
```

## Run The Docker Container

### Run the Docker container
```bash
docker run -d -p 80:80 enphase-monitor
```

### Open a browser and navigate to
```bash
http://localhost
```