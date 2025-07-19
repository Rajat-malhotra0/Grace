# Grace

Grace is an NGO unifier and support platform designed to uplift those who uplift others. This project provides a comprehensive solution for connecting compassionate hearts to transform communities.

---

## 🌟 Features

-   **NGO Registration & Discovery:** NGOs can register and get discovered by donors and volunteers.
-   **Volunteer & Donor Matching:** Intelligent matching for volunteers and donors based on interests and skills.
-   **Task & Event Management:** NGOs can manage tasks, events, and volunteers efficiently.
-   **Impact Stories:** Share and browse real stories of change and impact.
-   **Marketplace:** NGOs can list specific needs; donors can fulfill them directly.
-   **Skill Surveys:** Volunteers can take quizzes to find the best way to contribute.
-   **Real-time Updates:** Live updates for tasks and collaboration using WebSockets.

---

## 🛠️ Tech Stack

-   **Frontend:** React.js, CSS
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB (Mongoose ODM)
-   **Real-time:** Socket.io
-   **Other:** Azure Maps, REST APIs

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or above recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [MongoDB](https://www.mongodb.com/) (local or cloud)

### Installation

1. **Clone the Repository**

    ```sh
    git clone https://github.com/Rajat-malhotra0/Grace.git
    cd Grace
    ```

2. **Install Dependencies**

    ```sh
    npm install
    cd backend && npm install
    cd ../frontend && npm install
    ```

3. **Environment Variables**

    - Copy `.env.example` to `.env` in the backend folder and fill in required values (MongoDB URI, JWT secrets, etc).

4. **Run the Project**

    ```sh
    npm run dev
    ```

    This will start both backend and frontend concurrently.

5. **Access the App**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:3001](http://localhost:3001)

---

## 📂 Project Structure

```
Grace/
  backend/
    models/
    routes/
    services/
    db/
    app.js
  frontend/
    src/
      Pages/
      Components/
      App.js
      index.js
  Readme.md
  package.json
```

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 🙏 Acknowledgements

-   All contributors and open-source libraries used.
-   Special thanks to the NGOs, volunteers, and donors making a difference.
