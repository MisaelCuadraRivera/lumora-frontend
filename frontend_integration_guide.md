# Frontend Integration Guide: S3 Presigned URL Uploads

This document outlines the changes and instructions required for the **lumora-frontend** repository to integrate with the new 2-step S3 direct-upload architecture.

---

## 🌌 Overview of the New Architecture

Previously, the frontend uploaded images to `/api/events` using `Multipart/Form-Data`. The Express server buffered the entire file in memory, uploaded it to S3, and then saved the event. This causes server latency, high memory usage, and file size limitations.

Now, we have migrated to a **2-step direct upload model (zero server memory buffering)**:
```
┌──────────┐              GET /api/media/presigned-url           ┌──────────┐
│          │ ──────────────────────────────────────────────────> │          │
│          │ <────────────────────────────────────────────────── │  Lumora  │
│          │          { uploadUrl, key: "events/..." }           │  Backend │
│          │                                                     └──────────┘
│          │                     PUT /file.jpg (Direct Upload)   ┌──────────┐
│          │ ──────────────────────────────────────────────────> │          │
│ Frontend │                                                     │  AWS S3  │
│          │ <────────────────────────────────────────────────── │  Bucket  │
│          │                       HTTP 200 OK                   └──────────┘
│          │                                                     ┌──────────┐
│          │                POST /api/events { imageKey: key }   │          │
│          │ ──────────────────────────────────────────────────> │  Lumora  │
│          │ <────────────────────────────────────────────────── │  Backend │
└──────────┘                 Event Created Successfully          └──────────┘
```

---

## 🔌 API Endpoint Reference

### 1. GET `/api/media/presigned-url`
Generates a time-limited (300 seconds) S3 Presigned PUT URL.

* **Authentication**: Required (JWT Bearer Token).
* **Query Parameters**:
  * `fileName` *(string, required)*: The name of the file (e.g., `avatar.png`).
  * `fileType` *(string, required)*: The MIME type of the file. Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
* **Success Response (200 OK)**:
  ```json
  {
    "uploadUrl": "https://lumora-public-media-prod-983240697548-us-east-2-an.s3.us-east-2.amazonaws.com/events/images/user-id/1716382902000-avatar.png?X-Amz-Algorithm=AWS4-HMAC-SHA256...",
    "key": "events/images/user-id/1716382902000-avatar.png"
  }
  ```

---

## 🛠️ Frontend Implementation Checklist

### 1. Create a Helper Function for Uploading Files
Implement a service or hook in the frontend to handle the 2-step S3 upload process.

```typescript
// services/mediaService.ts
import api from './api'; // Your Axios instance

interface PresignedResponse {
  uploadUrl: string;
  key: string;
}

/**
 * Uploads a file directly to S3 using a Presigned URL
 * @param file The file object from the input element
 * @returns The unique S3 key representing the uploaded file
 */
export async function uploadFileToS3(file: File): Promise<string> {
  // Step 1: Request presigned URL from Lumora Backend
  const { data } = await api.get<PresignedResponse>('/media/presigned-url', {
    params: {
      fileName: file.name,
      fileType: file.type,
    },
  });

  const { uploadUrl, key } = data;

  // Step 2: Upload file binary directly to AWS S3 using PUT
  // Note: We bypass our API Axios instance to avoid attaching our JWT to AWS S3
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file to S3: ${response.statusText}`);
  }

  // Return the key to submit in the second request
  return key;
}
```

---

### 2. Update Event Creation & Update Forms
Replace `FormData` with a standard `JSON` payload when calling `POST /api/events` and `PUT /api/events/:id`.

#### ❌ BEFORE (Multipart Form-Data)
```typescript
const formData = new FormData();
formData.append('title', eventData.title);
formData.append('description', eventData.description);
if (imageFile) formData.append('image', imageFile); // Sent as a multi-part file

await api.post('/events', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

#### ✅ AFTER (JSON body with S3 Keys)
```typescript
// 1. Upload file if selected
let imageKey = null;
if (imageFile) {
  imageKey = await uploadFileToS3(imageFile);
}

// 2. Submit payload as clean JSON
const payload = {
  title: eventData.title,
  description: eventData.description,
  date: eventData.date,
  location: eventData.location,
  imageKey: imageKey, // Unique key returned from step 1
  bannerKey: bannerKey,
  maxAttendees: eventData.maxAttendees,
  isPublic: eventData.isPublic,
};

await api.post('/events', payload, {
  headers: { 'Content-Type': 'application/json' }
});
```

---

## 🌐 Important CORS Notice

To allow the frontend (`http://localhost:3000` / `http://localhost:3002` / `http://localhost:3003`) to upload files directly to S3, your S3 bucket must have CORS configured. 

If direct uploads fail with preflight CORS errors, verify that your S3 Bucket CORS configuration allows:
* **AllowedOrigins**: `http://localhost:3000`, `http://localhost:3002`, `http://localhost:3003` (or your staging/production domain).
* **AllowedMethods**: `PUT`, `GET`.
* **AllowedHeaders**: `*`.
* **ExposeHeaders**: `ETag`.

---

## 🔄 Rollback and Backward Compatibility
For maximum system stability, the Express backend has **preserved** the legacy `upload.js` Multer middleware inside `src/middlewares/upload.js`. 

If you ever need to rollback to the old buffered upload method, you simply restore the `upload` middleware import in the backend routes and change the body type back to `multipart/form-data` in the frontend.
