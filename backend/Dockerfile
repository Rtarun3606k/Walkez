# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app"]