# Use the official Nginx image as the base image
FROM nginx:latest

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the web files to the appropriate directory
COPY public /usr/share/nginx/html
COPY test /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]