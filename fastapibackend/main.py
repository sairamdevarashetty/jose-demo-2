from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
from pydantic import BaseModel
import re

app = FastAPI()

# Allow all origins for testing purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify a list of origins, like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

def normalize_company_name(name):
    """Normalize company name by removing spaces and converting to lowercase."""
    return name.lower().replace(" ", "")

def is_generic_request(sentence):
    """Check if the sentence is a generic request for all plans."""
    generic_keywords = ["todas las compañías", "todos los planes", "planes médicos", "información sobre planes"]
    sentence_lower = sentence.lower()
    return any(keyword in sentence_lower for keyword in generic_keywords)

def get_company_aliases():
    """Define a mapping of company aliases to full company names."""
    return {
        "wwm": "World Wide Medical",  # Alias for World Wide Medical
        "bluecross": "Blue Cross Blue Shield",  # Alias for Blue Cross Blue Shield
    }

def route_query_to_alias(query):
    """Route queries for full company names to the alias."""
    # Create a dictionary to map user query phrases to aliases
    alias_mapping = {
        "world wide medical": "wwm",
        "blue cross": "bluecross",
        "blue cross blue shield": "bluecross",
    }
    
    # Normalize and remove spaces for better matching
    normalized_query = query.lower().replace(" ", "")
    
    # Return the alias if a match is found
    for key, alias in alias_mapping.items():
        if key.replace(" ", "") in normalized_query:
            return alias
    return None  # If no alias is found, return None

def extract_companies_from_sentence(sentence):
    """Extract company aliases from the sentence and map them to full company names."""
    company_alias = route_query_to_alias(sentence)
    if company_alias:
        return [company_alias]  # Return the alias of the company found in the query
    return []  # Return empty if no specific company is found

def get_plan_by_sentence(data, sentence):
    """
    Automatically understands the sentence to:
    - Extract relevant company names using aliases.
    - Retrieve all corresponding plans.
    - Handle generic requests for all plans if no specific match is found.
    """
    if is_generic_request(sentence):
        # Return all plans regardless of the company
        return [item["plan"] for item in data]

    # Extract companies dynamically from the sentence using aliases
    extracted_companies = extract_companies_from_sentence(sentence)

    if not extracted_companies:
        # If no specific company is found, assume a generic request and return all plans
        return [item["plan"] for item in data]

    # Return all plans for the extracted companies
    result = {}
    for company_alias in extracted_companies:
        company_name = get_company_aliases().get(company_alias)
        
        if company_name:  # If alias exists in the mapping
            plans = [item["plan"] for item in data if normalize_company_name(item["compania"]) == company_alias]
            result[company_name] = plans

    return result

@app.post("/search_query")  # Define the API endpoint
async def search_query(payload: dict):
    query = payload.get("query", "").lower()
    try:
        with open("output.json", "r") as file:  # Assuming your JSON file is stored locally
            data = json.load(file)
    except FileNotFoundError:
        return {"success": False, "message": "Data file not found."}
    except json.JSONDecodeError:
        return {"success": False, "message": "Error reading data file."}

    results = get_plan_by_sentence(data, query)
    if results:
        return {"success": True, "plans": results}
    else:
        return {"success": False, "message": "No plans found."}
    
# Define request model for the user input question
class QuestionRequest(BaseModel):
    question: str


# Helper function to search for ambulancia aerea in the coverage or conditions
def find_plans_with_ambulancia_aerea(data, company_name=None):
    result = []
    for entry in data:
        # Check if the entry contains "ambulancia aerea" in 'coberturas' or 'condiciones'
        if re.search(r'ambulancia aérea', entry.get('coberturas', '').lower()) or \
           re.search(r'ambulancia aérea', entry.get('condiciones', '').lower()):
            # If company name is specified, filter by company
            if company_name:
                if entry['compania'].lower() == company_name.lower():
                    result.append({
                        "plan": entry['plan'],
                        "compania": entry['compania']
                    })
            else:
                result.append({
                    "plan": entry['plan'],
                    "compania": entry['compania']
                })
    return result

# Endpoint to handle the user's question
@app.post("/find_plans")
async def find_plans(request: QuestionRequest):
    question = request.question.lower()
    
    # Search for a company name in the question
    company_match = re.search(r'compañía\s(\w+)', question)

    try:
        with open("output.json", "r") as file:  # Assuming your JSON file is stored locally
            data = json.load(file)
    except FileNotFoundError:
        return {"success": False, "message": "Data file not found."}
    except json.JSONDecodeError:
        return {"success": False, "message": "Error reading data file."}
    
    if company_match:
        # Extract company name from the question
        company_name = company_match.group(1)
        # Find plans for the specific company
        plans = find_plans_with_ambulancia_aerea(data, company_name)
    else:
        # Find all plans providing ambulancia aerea service
        plans = find_plans_with_ambulancia_aerea(data)
    
    if not plans:
        return {"message": "No se encontraron planes con ambulancia aérea."}
    
    # Return the plans as response
    return {"plans": plans}

if __name__ == "__main__":
    # Start the server with uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
