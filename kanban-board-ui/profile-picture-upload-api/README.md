# Profile Picture Upload API

A simple Express.js API that allows users to upload profile pictures to Supabase Storage. The API accepts image files using Multer, stores them in a Supabase Storage bucket, and returns a public URL for the uploaded image.

## Features

- Upload profile pictures
- Store images in Supabase Storage
- Generate a public URL for uploaded images
- REST API built with Express.js
- File upload handling using Multer
- Environment variables managed with dotenv

## Technologies Used

- Node.js
- Express.js
- Supabase Storage
- Multer
- Dotenv
- CORS

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project folder:

```bash
cd profile-picture-upload-api
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file and add:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
```

5. Start the server:

```bash
npm start
```

The server will run at:

```
http://localhost:5000
```

## API Endpoints

### Check Server Status

**GET /**

Returns a message confirming that the API is running.

### Upload Profile Picture

**POST /api/upload**

#### Request

- Method: POST
- Body: form-data
- Key: `image`
- Type: File

#### Response

```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://your-project.supabase.co/storage/v1/object/public/profile-pictures/image.jpg"
}
```

## Project Structure

```
profile-picture-upload-api
│
├── routes
│   └── upload.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── supabase.js
```

## Learning Outcomes

- Built a REST API using Express.js
- Connected an Express application with Supabase
- Uploaded images using Multer
- Stored files in Supabase Storage
- Generated public URLs for uploaded images
- Tested APIs using Postman

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/72f1adf0-c406-4c6b-ae81-1f7b475c2cec" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/accf84eb-0da8-41e5-9579-0df1cf009fbf" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/049f8433-b5fd-4f61-a9f8-6219fff59423" />

<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/877962f7-3567-4e96-b68b-b451906212ad" />
