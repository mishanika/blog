FROM node:17-alpine3.12

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# Install dependecies
#RUN npm set progress=false \
#    && npm config set depth 0 \
#    && npm i install
RUN npm ci

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]


# COPY package.json .

# COPY package-lock.json .

# RUN npm install # -g npm@8.9.0

# COPY . .

# EXPOSE 3030

# CMD ["npm", "start"]