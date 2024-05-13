# speaker-verification-demo

## How to set up the project.

### Backend

1. Install python 3.8 or above
2. Create and actiate virtual environment inside project folder
3. Install required libraries : `pip3 install -r requirements.txt`

### Run the project

1. uvicorn `uvicorn app.main:app --reload`
2. Swagger documentation is available at : `http://{host}:{port}/docs#`

### Save Dependancies

1. Run `pip3 freeze > requirements.txt` after installing any pip package