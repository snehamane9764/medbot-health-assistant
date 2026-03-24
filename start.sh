#!/bin/bash

# MedBot Health Assistant - Quick Start Script for Mac M2
# This script helps you run the backend and web frontend easily

echo "🏥 MedBot Health Assistant - Quick Start"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Python 3
echo -e "${BLUE}Checking Python 3...${NC}"
if command_exists python3; then
    echo -e "${GREEN}✓ Python 3 found: $(python3 --version)${NC}"
else
    echo -e "${RED}✗ Python 3 not found. Please install Python 3.${NC}"
    exit 1
fi

# Check pip3
echo -e "${BLUE}Checking pip3...${NC}"
if command_exists pip3; then
    echo -e "${GREEN}✓ pip3 found${NC}"
else
    echo -e "${RED}✗ pip3 not found. Installing...${NC}"
    python3 -m ensurepip --upgrade
fi

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if command_exists node; then
    echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
else
    echo -e "${YELLOW}⚠ Node.js not found. Web frontend will not work.${NC}"
    echo -e "${YELLOW}Install with: brew install node${NC}"
fi

echo ""
echo "========================================"
echo "Which component would you like to run?"
echo "========================================"
echo "1) Backend API only"
echo "2) CLI (Command Line Interface) only"
echo "3) Web Frontend only (requires backend running)"
echo "4) Backend + Web Frontend (recommended)"
echo "5) Setup all dependencies"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo -e "${BLUE}Starting Backend API...${NC}"
        cd backend || exit
        
        # Check if venv exists
        if [ ! -d "venv" ]; then
            echo -e "${YELLOW}Creating virtual environment...${NC}"
            python3 -m venv venv
        fi
        
        # Activate venv
        source venv/bin/activate
        
        # Install requirements
        echo -e "${YELLOW}Installing requirements...${NC}"
        pip3 install -q -r requirements.txt
        
        # Run backend
        echo -e "${GREEN}✓ Starting Flask server on http://localhost:5000${NC}"
        python3 app.py
        ;;
        
    2)
        echo -e "${BLUE}Starting CLI...${NC}"
        cd cli || exit
        python3 medbot_cli.py
        ;;
        
    3)
        echo -e "${BLUE}Starting Web Frontend...${NC}"
        echo -e "${YELLOW}⚠ Make sure backend is running on http://localhost:5000${NC}"
        cd web-frontend || exit
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}Installing npm packages (this may take a few minutes)...${NC}"
            npm install
        fi
        
        # Start React app
        echo -e "${GREEN}✓ Starting React app on http://localhost:3000${NC}"
        npm start
        ;;
        
    4)
        echo -e "${BLUE}Starting Backend + Web Frontend...${NC}"
        
        # Start backend in background
        echo -e "${YELLOW}Starting backend...${NC}"
        cd backend || exit
        
        if [ ! -d "venv" ]; then
            python3 -m venv venv
        fi
        
        source venv/bin/activate
        pip3 install -q -r requirements.txt
        python3 app.py &
        BACKEND_PID=$!
        
        # Wait for backend to start
        echo -e "${YELLOW}Waiting for backend to start...${NC}"
        sleep 3
        
        # Start frontend
        cd ../web-frontend || exit
        
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}Installing npm packages...${NC}"
            npm install
        fi
        
        echo -e "${GREEN}✓ Backend running on http://localhost:5000${NC}"
        echo -e "${GREEN}✓ Starting frontend on http://localhost:3000${NC}"
        npm start
        
        # Cleanup on exit
        trap "kill $BACKEND_PID" EXIT
        ;;
        
    5)
        echo -e "${BLUE}Setting up all dependencies...${NC}"
        
        # Backend
        echo -e "${YELLOW}Setting up backend...${NC}"
        cd backend || exit
        python3 -m venv venv
        source venv/bin/activate
        pip3 install -r requirements.txt
        cd ..
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
        
        # Web Frontend
        if command_exists node; then
            echo -e "${YELLOW}Setting up web frontend...${NC}"
            cd web-frontend || exit
            npm install
            cd ..
            echo -e "${GREEN}✓ Web frontend dependencies installed${NC}"
        else
            echo -e "${YELLOW}⚠ Skipping web frontend (Node.js not found)${NC}"
        fi
        
        # Mobile App (optional)
        if command_exists node; then
            echo -e "${YELLOW}Setting up mobile app (optional)...${NC}"
            cd mobile-app || exit
            npm install
            cd ..
            echo -e "${GREEN}✓ Mobile app dependencies installed${NC}"
        fi
        
        echo -e "${GREEN}✓ All dependencies installed!${NC}"
        echo -e "${BLUE}You can now run option 4 to start the application.${NC}"
        ;;
        
    6)
        echo -e "${GREEN}Goodbye!${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac
