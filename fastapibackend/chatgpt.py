import os
from openai import AzureOpenAI

# Initialize Azure client
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2025-04-01-preview",  # Latest preview for Assistants v2 and vector stores
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

# Step 1: Upload a file (e.g., financial report PDF) for vector storage
# Replace 'financial_report.pdf' with your actual file path
with open("financial_report.pdf", "rb") as file_data:
    uploaded_file = client.files.create(
        file=file_data,
        purpose="assistants"  # Required for Assistants and vector stores
    )
file_id = uploaded_file.id
print(f"Uploaded file ID: {file_id}")

# Step 2: Create a vector store and add the file to it
vector_store = client.beta.vector_stores.create(
    name="Financial Reports Vector Store",
    file_ids=[file_id]  # Add your uploaded file(s) here; max 20 for basic usage
)
vector_store_id = vector_store.id
print(f"Created vector store ID: {vector_store_id}")

# Step 3: Create the assistant with file_search tool and attach the vector store
assistant = client.beta.assistants.create(
    name="Financial Analyst Assistant",
    instructions="You are an expert financial analyst. Use the provided documents to answer questions about financial statements, focusing on revenue shares and verticals.",
    model="your-deployment-name-here",  # <-- Replace with your actual Azure deployment name (e.g., "my-gpt4o-deployment")
    tools=[{"type": "file_search"}],  # Enable the file search tool (uses vector store)
    tool_resources={
        "file_search": {
            "vector_store_ids": [vector_store_id]  # Attach the vector store (max 1 per assistant)
        }
    }
)
print(f"Created assistant ID: {assistant.id}")

# Step 4: Create a thread and add the user message
thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": "What is the revenue share across verticals in 2023-2024?"
        }
    ]
)

# Step 5: Run the assistant (it will use the vector store for retrieval)
run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id,
)

# Step 6: Retrieve and print the latest message (assistant's response)
messages = list(client.beta.threads.messages.list(thread_id=thread.id))
print(messages[0].content[0].text.value)  # The response, now informed by the vector store
