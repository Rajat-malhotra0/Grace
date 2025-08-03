# Database Seeding Guide

This folder contains scripts to populate your Grace application database with sample data.

## Files Overview

-   `connect.js` - Database connection configuration
-   `addCategories.js` - Adds NGO and donation categories
-   `addNgo.js` - Creates sample NGOs with users
-   `addMarketplaceData.js` - Adds marketplace donation needs (same data as frontend)
-   `seedAll.js` - Master script to run all seeders in correct order

## Quick Start

### Option 1: Run All Seeders (Recommended)

```bash
cd backend/db
node seedAll.js
```

### Option 2: Run Individual Seeders

```bash
# Step 1: Add categories first
node addCategories.js

# Step 2: Add NGOs (requires categories)
node addNgo.js

# Step 3: Add marketplace data (requires NGOs)
node addMarketplaceData.js
```

## What Gets Seeded

### Categories

-   **NGO Categories**: Education, Health, Women Empowerment, Environment, etc.
-   **Donation Categories**: Food & Nutrition, Clothing, Technology, Medical Supplies, etc.

### NGOs

-   6 sample NGOs with real descriptions
-   Associated user accounts for each NGO
-   Cloudinary images for NGO profiles
-   Proper category associations

### Marketplace Data

-   **Exact same data** as your frontend DonationNeeds files
-   All 9 donation categories covered
-   Real NGO associations
-   Proper urgency levels and dates
-   Sample items include:
    -   Food items (Rice, Oil, Dal, Flour)
    -   Clothing (Jackets, Sweaters, Uniforms)
    -   Books & Stationery (Textbooks, Notebooks, Pens)
    -   Medical supplies (First Aid, Sanitizers, Masks)
    -   Technology (Laptops, Tablets, Smartphones)
    -   And much more...

## Data Summary

After seeding, you'll have:

-   **40+ marketplace items** across all categories
-   **35+ NGOs** from various locations across India
-   **18 categories** (9 donation + 9 NGO categories)
-   **Mock user accounts** for testing

## Prerequisites

1. MongoDB running locally or connection to MongoDB Atlas
2. Proper database connection string in `connect.js`
3. All required npm packages installed
4. Cloudinary credentials configured (for NGO images)

## Troubleshooting

**Error: Cannot connect to MongoDB**

-   Check if MongoDB is running
-   Verify connection string in `connect.js`

**Error: Categories not found**

-   Run `addCategories.js` first
-   Categories are required before adding NGOs or marketplace items

**Error: NGOs not found**

-   Run `addNgo.js` before `addMarketplaceData.js`
-   Marketplace items need NGOs to reference

## Environment Setup

Make sure you have these environment variables set:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Notes

-   The seeder clears existing data before inserting new data
-   NGO images are uploaded to Cloudinary during seeding
-   All marketplace data matches exactly with your frontend files
-   Mock users are created with simple passwords for testing

Run `node seedAll.js` to get started! 🚀
