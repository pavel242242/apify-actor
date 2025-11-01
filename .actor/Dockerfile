# Use the official Apify Python base image
FROM apify/actor-python:3.12

# Set the working directory (base image uses /home/myuser)
WORKDIR /home/myuser

# Copy requirements.txt to the container
COPY --chown=myuser:myuser requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project to the container
COPY --chown=myuser:myuser . ./

# Set the entrypoint to run the Actor
CMD ["python", "-m", "src"]
