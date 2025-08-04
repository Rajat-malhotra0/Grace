# Grace Database Setup

This folder contains all database seeding and setup scripts for the Grace NGO platform.

## 🚀 Quick Start

### 1. Test Database Connection

```bash
npm run test-db
```

### 2. Seed Complete Database

```bash
npm run seed
```

### 3. Setup Chatbot Knowledge Base

```bash
npm run setup-chatbot
```

## 📁 File Structure

### Core Files

-   **`connect.js`** - Database connection utility
-   **`seedAll.js`** - Master seeding script (runs everything)
-   **`test-db.js`** - Database connection testing

### Data Seeding Scripts

-   **`addCategories.js`** - NGO and donation categories
-   **`seedCompleteNgoData.js`** - Complete NGO profiles with Cloudinary images/videos
-   **`addUsers.js`** - Diverse user base with relationships
-   **`addTasks.js`** - Volunteer tasks and assignments
-   **`addMarketplaceData.js`** - Donation marketplace items
-   **`addImpactStories.js`** - Success stories and testimonials
-   **`addNgoReports.js`** - NGO performance reports
-   **`addArticles.js`** - Chatbot knowledge base articles

## 🎯 Usage Patterns

### Complete Setup (Recommended)

```bash
# This runs everything in the correct order
npm run seed
```

### Individual Components

```bash
# Test connection first
npm run test-db

# Run individual seeders (only if needed)
node db/addCategories.js
node db/seedCompleteNgoData.js
node db/addUsers.js
# ... etc
```

### Chatbot Setup

```bash
# After seeding, setup chatbot
npm run setup-chatbot

# Test chatbot
npm run test-chatbot

# Fix articles if needed
npm run fix-articles
```

## 📊 What Gets Created

### Users & Authentication

-   **6 NGO accounts** with full profiles
-   **20+ volunteers** with different specializations
-   **5+ donors** with contribution history
-   **Test accounts** for all user types
-   **Admin account** for platform management

### NGO Data

-   **Complete NGO profiles** with Cloudinary assets
-   **Projects and programs** with images
-   **Volunteer opportunities** with detailed descriptions
-   **Donation options** and fundraising goals
-   **Contact information** and verification status

### Platform Content

-   **50+ marketplace items** across all categories
-   **Impact stories** showcasing success
-   **Volunteer tasks** with progress tracking
-   **NGO reports** for performance monitoring
-   **Articles** for chatbot knowledge base

### Categories

-   **NGO Categories**: Children, Education, Environment, Healthcare, etc.
-   **Donation Categories**: Food, Clothing, Medical Supplies, Technology, etc.

## 🔑 Login Credentials

### Test Accounts

-   **Admin**: `admin@grace.org` / `admin123`
-   **Volunteer**: `test@volunteer.com` / `password123`
-   **Donor**: `test@donor.com` / `password123`
-   **NGO Member**: `test@member.com` / `password123`

### NGO Accounts

-   **Little Lanterns**: `littlelanterns@grace.org` / `password123`
-   **Aasha Sapne**: `aashasapne@grace.org` / `password123`
-   **Earth Nest**: `earthnest@grace.org` / `password123`
-   **Her Rise**: `herrise@grace.org` / `password123`
-   **Health First**: `healthfirst@grace.org` / `password123`
-   **Learning Bridge**: `learningbridge@grace.org` / `password123`

### Sample Volunteers

-   **Priya Sharma**: `priya.sharma@example.com` / `password123`
-   **Raj Patel**: `raj.patel@example.com` / `password123`
-   **Ananya Singh**: `ananya.singh@example.com` / `password123`

## 🛠️ Script Dependencies

### Order of Execution (seedAll.js handles this)

1. **Categories** - Must be first (NGOs depend on categories)
2. **Complete NGOs** - Creates NGO accounts and profiles
3. **Login Users** - Essential authentication accounts
4. **Additional Users** - Volunteers, donors, members
5. **Tasks** - Volunteer assignments
6. **Marketplace** - Donation items
7. **Impact Stories** - Success testimonials
8. **Articles** - Chatbot knowledge base
9. **NGO Reports** - Performance data

## 🔧 Configuration

### Environment Variables Required

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/grace

# Cloudinary (for image/video uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Chatbot (for articles)
GEMINI_API_KEY=your_gemini_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key
```

## 📈 Performance Notes

-   **Seeding Time**: ~2-3 minutes (includes Cloudinary uploads)
-   **Database Size**: ~50MB after complete seeding
-   **Image Uploads**: ~20 images uploaded to Cloudinary
-   **Video Uploads**: ~2 videos uploaded to Cloudinary

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

    ```bash
    # Check if MongoDB is running
    mongosh
    # Or restart MongoDB service
    ```

2. **Cloudinary Upload Errors**

    ```bash
    # Check environment variables
    echo $CLOUDINARY_CLOUD_NAME
    # Verify API credentials in .env
    ```

3. **Chatbot Setup Failed**

    ```bash
    # Run fix script
    npm run fix-articles
    # Check Qdrant connection
    ```

4. **Categories Not Found**
    ```bash
    # Run categories first
    node db/addCategories.js
    ```

### Reset Database

```bash
# Connect to MongoDB and drop database
mongosh grace --eval "db.dropDatabase()"

# Re-run seeding
npm run seed
```

## 🧹 Maintenance

### Adding New Data

-   **New NGOs**: Add to `seedCompleteNgoData.js`
-   **New Categories**: Add to `addCategories.js`
-   **New Articles**: Add to `addArticles.js`
-   **New Users**: Add to `addUsers.js`

### Updating Existing Data

-   **Modify scripts** and re-run specific seeders
-   **Use MongoDB directly** for small changes
-   **Re-run complete seeding** for major updates

## ✅ Health Check

After seeding, verify:

-   [ ] All NGOs have images and videos
-   [ ] Users can log in with provided credentials
-   [ ] Marketplace has items in all categories
-   [ ] Chatbot responds to queries
-   [ ] Impact stories are visible
-   [ ] Tasks are assigned to users

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify environment variables are set
3. Ensure MongoDB is running
4. Check server logs for specific errors

The database setup is designed to be simple, reliable, and complete. One command (`npm run seed`) should give you a fully functional Grace platform!
