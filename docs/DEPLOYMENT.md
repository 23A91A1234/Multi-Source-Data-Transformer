# Deployment Guide

This guide walks you through deploying the **Candidate Data Transformer** application to **Render** and connecting it to a free **MongoDB Atlas** database cluster.

---

## 💾 Step 1: Create a Free MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or create a free account.
2. Click **Create** to spin up a new database cluster. Select the **M0 (Free)** shared tier.
3. Choose your preferred cloud provider (e.g. AWS) and region, then click **Create Cluster**.
4. In the **Security Quickstart**:
   - Create a database user. Save the **Username** and **Password** (you will need them in the connection string).
   - Under **IP Access List**, add `0.0.0.0/0` to allow connections from Render (or lookup Render's outbound IP ranges if you want a tighter firewall).
5. Go to the Database dashboard, click **Connect** on your cluster, and choose **Drivers** (Node.js).
6. Copy the connection string. It will look like this:
   ```bash
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   *Replace `<username>` and `<password>` with your created database credentials.*

---

## 🚀 Step 2: Deploy to Render using Blueprints (one-click)

We have included a `render.yaml` Blueprint specification file in the project. This allows Render to read the configuration and set up both the backend and frontend automatically.

1. Go to [Render](https://render.com/) and sign in.
2. In the Render Dashboard, click **New** (top right) and select **Blueprint**.
3. Link your GitHub account and select your **Multi-Source-Data-Transformer** repository.
4. Render will automatically detect the `render.yaml` file. Under **Blueprint Config**:
   - Give the group a name (e.g. `candidate-transformer`).
   - Render will prompt you to input the `MONGODB_URI` environment variable.
   - Paste the connection string you copied from MongoDB Atlas in Step 1.
5. Click **Apply**.
6. Render will automatically spin up:
   - **Express API Web Service** (`candidate-data-transformer-api`)
   - **React Web Static Site** (`candidate-data-transformer-web`)

---

## 🔍 Step 3: Verify the Deployment

1. Once the builds are successful (status turns to `Live`), open the URL for your **React Web Static Site** (provided in Render, e.g. `https://candidate-data-transformer-web.onrender.com`).
2. Test the app:
   - Check the **Database Status** indicator in the top header (it should show a green "Connected" badge).
   - Try uploading some mock CV files or entering GitHub usernames to verify the pipeline.
