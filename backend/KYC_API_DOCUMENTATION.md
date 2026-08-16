# KYC API Documentation

## Overview
This API provides endpoints for managing Know Your Customer (KYC) verification process.

## Authentication
All endpoints require JWT authentication via the `verifyJwt` middleware.

## Endpoints

### User Endpoints

#### Submit KYC
**POST** `/api/kyc/submit/:userId`

Submit KYC documents for verification.

**Parameters:**
- `userId` (path): User ID

**Form Data:**
- `documentType`: enum ['passport', 'national_id', 'drivers_license']
- `documentNumber`: string (required)
- `fullName`: string (required)
- `dateOfBirth`: date (required)
- `address`: string (required)
- `country`: string (required)
- `documentImage`: file (required) - Document photo
- `selfieImage`: file (required) - Selfie with document

**Response:**
```json
{
  "message": "KYC submitted successfully",
  "kyc": { ... }
}
```

#### Get User KYC
**GET** `/api/kyc/user/:userId`

Get KYC submission for a specific user.

**Parameters:**
- `userId` (path): User ID

**Response:**
```json
{
  "_id": "...",
  "userId": "...",
  "status": "pending|approved|rejected",
  "documentType": "...",
  "adminNotes": "...",
  ...
}
```

### Admin Endpoints

#### Get Pending KYCs
**GET** `/api/kyc/pending?page=1&limit=10`

Get all pending KYC submissions for admin review.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "kycs": [...],
  "page": 1,
  "totalPages": 5,
  "total": 50
}
```

#### Get All KYCs
**GET** `/api/kyc/all?page=1&limit=10`

Get all KYC submissions with pagination.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "kycs": [...],
  "page": 1,
  "totalPages": 5,
  "total": 50
}
```

#### Get KYC by ID
**GET** `/api/kyc/:kycId`

Get specific KYC submission details.

**Parameters:**
- `kycId` (path): KYC submission ID

**Response:**
```json
{
  "_id": "...",
  "userId": { ... },
  "documentImage": "...",
  "selfieImage": "...",
  "status": "...",
  ...
}
```

#### Approve KYC
**PUT** `/api/kyc/approve/:kycId`

Approve a KYC submission.

**Parameters:**
- `kycId` (path): KYC submission ID

**Body:**
```json
{
  "adminId": "admin_user_id",
  "notes": "Optional approval notes"
}
```

**Response:**
```json
{
  "message": "KYC approved successfully",
  "kyc": { ... }
}
```

#### Reject KYC
**PUT** `/api/kyc/reject/:kycId`

Reject a KYC submission.

**Parameters:**
- `kycId` (path): KYC submission ID

**Body:**
```json
{
  "adminId": "admin_user_id",
  "notes": "Required rejection reason"
}
```

**Response:**
```json
{
  "message": "KYC rejected successfully",
  "kyc": { ... }
}
```

## KYC Status Flow
1. `not_submitted` - User hasn't submitted KYC
2. `pending` - KYC submitted, waiting for admin review
3. `approved` - Admin approved KYC, user is verified
4. `rejected` - Admin rejected KYC, user needs to resubmit

## File Upload Requirements
- Maximum file size: 10MB
- Supported formats: Images (JPEG, PNG, WebP)
- Files are automatically compressed and converted to WebP format
- Images are stored in Cloudinary under folders:
  - Documents: `kryptogain/kyc/documents/`
  - Selfies: `kryptogain/kyc/selfies/`

## Error Responses
```json
{
  "message": "Error description"
}
```

Common error codes:
- 400: Bad Request (missing data, validation errors)
- 404: Not Found (KYC/User not found)
- 500: Internal Server Error