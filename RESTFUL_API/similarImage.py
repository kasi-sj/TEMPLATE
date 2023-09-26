import pinecone
import torch
from torchvision import models, transforms
from PIL import Image
import io

# Initialize Pinecone outside the function
pinecone.init(
    api_key='8ad10559-f924-4ece-8924-3a7a398b52df',
    environment='gcp-starter'
)

# Load the pre-trained model outside the function
model = models.resnet50(pretrained=True)
model = torch.nn.Sequential(*(list(model.children())[:-1]))  # Remove the last layer
model.eval()

# Define the image transformations
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def query_pinecone_with_image_data(image_data):
    # Convert binary image data to a PIL image
    image = Image.open(io.BytesIO(image_data))

    # Preprocess the image
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0)

    # Make sure we don't compute gradients
    with torch.no_grad():
        output = model(input_batch)

    output_vector = torch.squeeze(output)
    output_vector = output_vector.numpy()
    print("ok1111")
    # Query Pinecone
    index = pinecone.Index('template')
    query_response = index.query(
        top_k=3,
        include_values=True,
        include_metadata=True,
        vector=output_vector.tolist(),
        filter={
            "genre": {"$in": ["image"]}
        }
    )
    for i in query_response["matches"]:
        print(i['score'])
    # Return the top matching ID
    return query_response['matches']


def upload_pinecone_with_image_data(image_data , imgUrl):
    # Convert binary image data to a PIL image
    image = Image.open(io.BytesIO(image_data))

    # Preprocess the image
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0)

    # Make sure we don't compute gradients
    with torch.no_grad():
        output = model(input_batch)

    output_vector = torch.squeeze(output)
    output_vector = output_vector.numpy()

    # Query Pinecone
    index = pinecone.Index('template')
    upsert_response = index.upsert(
    vectors=[
        (
         imgUrl,                # Vector ID 
         output_vector.tolist(),  # Dense vector values
         {"genre": "image"}     # Vector metadata
        ),
    ],
)

    # Return the top matching ID
    return upsert_response;

