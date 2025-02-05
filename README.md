# Walkez

This repository contains the code for the Walkez project.

## Overview

This project is built using [React](https://reactjs.org/) and [Vite](https://vitejs.dev/). Vite is a fast build tool that serves your code through a local server and provides hot module replacement.

## Table of Content
- [Frontend](#frontend)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
  - [Linting](#linting)
  - [Formatting](#formatting)
  - [Docker Setup](#docker-setup)
- [Backend - Flask Application](#backend---flask-application)
  - [Prerequisites](#prerequisites-1)
  - [Installation](#installation-1)
  - [Running the Application](#running-the-application)
- [Learn More](#learn-more)
- [License](#license)
-----------------------------
## Frontend

### Prerequisites

Ensure you have the following installed:
- Node.js (version 14.0.0 or higher recommended)
- npm (version 6.0.0 or higher recommended) or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Rtarun3606k/Walkez.git
    cd Walkez
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To start the development server, run:
```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To create a production build, run:
```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist` directory.

### Linting 

To lint the code, run:
```bash
npm run lint
# or
yarn lint
```

### Formatting

To format the code, run:
```bash
npm run format
# or
yarn format
```

### Docker Setup
To run the docker for the project (only frontend)

1. First change the directory to the `frontend`

```
 cd frontend
```
2. Build the docker image:
```
  docker build -t walkez-image:1.0  .
```
3. Run the container:

```
  docker run -d -p 3000:80 --name walkez-app  walkez-image:1.0
```


--------------------------
## Backend - Flask Application

### Prerequisites

Ensure you have the following installed:
- Python (version 3.6 or higher)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Rtarun3606k/Walkez.git
    cd Walkez
    cd backend
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3. Activate the virtual environment:
    - On Windows:
      ```bash
      venv\Scripts\activate
      ```
    - On Unix or MacOS:
      ```bash
      source venv/bin/activate
      ```

4. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Running the Application

To start the application, run:
```bash
python wsgi.py
```

The app will be available at [http://localhost:5000](http://localhost:5000).

------------------

## Learn More
To learn more about Flask, take a look at the following resources:
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)

----------------
 
 ## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


 
