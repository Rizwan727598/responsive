require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 2000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =
  "mongodb+srv://parecl-server-project-10:hNHQm6uOyC7p86Xz@cluster0.s0sni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB connection string // Use environment variable for your MongoDB URI // Use environment variable for your MongoDB URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let usersCollection;
let parcelsCollection;
let deliveryMenCollection;
let parcelServicesCollection;

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const db = client.db("parcelManagement"); // Replace with your database name
    usersCollection = db.collection("users");
    parcelsCollection = db.collection("parcels");
    deliveryMenCollection = db.collection("deliveryMen");

    // Get User Role
    app.get("/api/users/role/:email", async (req, res) => {
      const { email } = req.params;
      try {
        const user = await usersCollection.findOne({ email });
        if (user) {
          res.status(200).send({ role: user.role });
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch user role", error });
      }
    });

    // Statistics for Admin Dashboard
    app.get("/api/admin/statistics", async (req, res) => {
      try {
        const totalParcels = await parcelsCollection.countDocuments();
        const deliveredParcels = await parcelsCollection.countDocuments({
          status: "delivered",
        });
        const totalUsers = await usersCollection.countDocuments();

        res.status(200).send({
          totalParcels,
          deliveredParcels,
          totalUsers,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch statistics", error });
      }
    });

    // Fetch All Parcels for Admin
    app.get("/api/admin/all-parcels", async (req, res) => {
      try {
        const parcels = await parcelsCollection.find().toArray();
        res.status(200).send(parcels);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch parcels", error });
      }
    });

    // Fetch All Users for Admin
    app.get("/api/admin/all-users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.status(200).send(users);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch users", error });
      }
    });

    // Fetch All Delivery Men for Admin
    app.get("/api/admin/all-delivery-men", async (req, res) => {
      try {
        const deliveryMen = await deliveryMenCollection.find().toArray();
        res.status(200).send(deliveryMen);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch delivery men", error });
      }
    });
    app.get("/api/reviews", async (req, res) => {
      try {
        const reviews = await reviewsCollection.find().toArray();
        res.status(200).send(reviews);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch reviews", error });
      }
    }); // Fetch all services
    app.get("/api/services", async (req, res) => {
      try {
        const services = await servicesCollection.find().toArray();
        res.status(200).send(services);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch services", error });
      }
    });

    app.get("/api/top-delivery-men", async (req, res) => {
      try {
        const topDeliveryMen = await deliveryMenCollection
          .find()
          .sort({ parcelsDelivered: -1, averageRating: -1 }) // Sort by parcels delivered and rating
          .limit(3)
          .toArray();

        res.status(200).send(topDeliveryMen);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch top delivery men", error });
      }
    }); // Get parcels by user email
    app.get("/parcels", async (req, res) => {
      const { email } = req.query;
      const parcels = await parcelsCollection.find({ email }).toArray();
      res.send(parcels);
    });

    // Delete a parcel by ID
    app.delete("/parcels/:id", async (req, res) => {
      const id = req.params.id;
      const result = await parcelsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role: "admin" } }
      );
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;

      try {
        const result = await usersCollection.deleteOne({
          _id: new ObjectId(userId),
        });

        if (result.deletedCount > 0) {
          res.status(200).json({
            message: "User deleted successfully",
            deletedCount: result.deletedCount,
          });
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
      }
    });
    app.post("/parcel-services", async (req, res) => {
      const parcelService = req.body;
      const result = await parcelServicesCollection.insertOne(parcelService);
      res.send(result);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send({ admin: user?.role === "admin" });
    });
    app.delete("/parcel-services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await parcelServicesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    // Update a parcel service
    app.patch("/parcel-services/:id", async (req, res) => {
      const id = req.params.id;
      const { name, category, price, weightRange, description } = req.body;

      // Validate required fields
      if (!name || !category || !price || !weightRange) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            name,
            category,
            price: parseFloat(price), // Ensure price is a number
            weightRange,
            description,
          },
        };

        const result = await parcelServicesCollection.updateOne(
          filter,
          updateDoc
        );

        if (result.modifiedCount > 0) {
          res.send({
            success: true,
            message: "Parcel service updated successfully.",
          });
        } else {
          res.status(404).send({ error: "No parcel service found to update." });
        }
      } catch (error) {
        console.error("Error updating parcel service:", error);
        res.status(500).send({
          error: "An error occurred while updating the parcel service.",
        });
      }
    });
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;

      try {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: user }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error updating profile", error });
      }
    });
    app.get("/parcels/:email", async (req, res) => {
      const email = req.params.email;

      try {
        const parcels = await parcelsCollection
          .find({ userEmail: email })
          .toArray();
        res.send(parcels);
      } catch (error) {
        res.status(500).send({ message: "Error fetching user parcels", error });
      }
    });
    app.post("/parcels", async (req, res) => {
      const parcel = req.body;

      try {
        const result = await parcelsCollection.insertOne(parcel);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error booking parcel", error });
      }
    });
    app.get("/delivery-men", async (req, res) => {
      try {
        const deliveryMen = await deliveryMenCollection.find().toArray();
        res.send(deliveryMen);
      } catch (error) {
        res.status(500).send({ message: "Error fetching delivery men", error });
      }
    });
    app.put("/parcels/assign/:id", async (req, res) => {
      const parcelId = req.params.id;
      const { deliveryManId, deliveryManName } = req.body;

      try {
        const result = await parcelsCollection.updateOne(
          { _id: new ObjectId(parcelId) },
          { $set: { deliveryManId, deliveryManName, status: "Assigned" } }
        );
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error assigning delivery man", error });
      }
    });
    app.get("/admin-statistics", async (req, res) => {
      try {
        const totalParcels = await parcelsCollection.countDocuments();
        const deliveredParcels = await parcelsCollection.countDocuments({
          status: "Delivered",
        });
        const totalUsers = await usersCollection.countDocuments();
        const totalRevenue = await parcelsCollection
          .aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
          ])
          .toArray();

        res.send({
          totalParcels,
          deliveredParcels,
          totalUsers,
          revenue: totalRevenue[0]?.totalRevenue || 0,
        });
      } catch (error) {
        res.status(500).send({ message: "Error fetching statistics", error });
      }
    });
    app.get("/menu/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const item = await menuCollection.findOne({ _id: new ObjectId(id) });
        res.send(item);
      } catch (error) {
        res.status(500).send({ message: "Error fetching menu item", error });
      }
    });
    app.patch("/users/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;

      try {
        const result = await usersCollection.updateOne(
          { _id: id }, // Replace with the appropriate filter for your user data
          { $set: updatedData }
        );
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
      }
    });

    app.get("/parcel-category-stats", async (req, res) => {
      try {
        const stats = await parcelsCollection
          .aggregate([
            {
              $group: {
                _id: "$category",
                quantity: { $sum: 1 },
                revenue: { $sum: "$price" },
              },
            },
            {
              $project: {
                category: "$_id",
                quantity: 1,
                revenue: 1,
                _id: 0,
              },
            },
          ])
          .toArray();

        res.send(stats);
      } catch (error) {
        console.error("Error fetching parcel category stats:", error);
        res
          .status(500)
          .send({ error: "Failed to fetch parcel category stats" });
      }
    });
    app.get("/admin-stats", async (req, res) => {
      try {
        const revenue = await parcelsCollection
          .aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }])
          .toArray();
        const usersCount = await usersCollection.countDocuments();
        const totalParcels = await parcelsCollection.countDocuments();
        const deliveredParcels = await parcelsCollection.countDocuments({
          status: "delivered",
        });

        res.send({
          revenue: revenue[0]?.total || 0,
          users: usersCount,
          totalParcels,
          deliveredParcels,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).send({ error: "Failed to fetch admin statistics" });
      }
    });

    app.post("/payments", async (req, res) => {
      const payment = req.body;

      try {
        const result = await paymentsCollection.insertOne(payment);
        res.send({ insertedId: result.insertedId });
      } catch (error) {
        console.error("Error saving payment:", error);
        res.status(500).send({ error: "Failed to save payment" });
      }
    });
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;

      if (!price) {
        return res.status(400).send({ error: "Price is required" });
      }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(price * 100), // Convert to smallest currency unit
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.send({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ error: "Failed to create payment intent" });
      }
    });
    app.get("/payments/:email", async (req, res) => {
      const email = req.params.email;

      try {
        const payments = await paymentsCollection
          .find({ email }) // Filter payments by user email
          .sort({ date: -1 }) // Sort by most recent payment
          .toArray();

        res.send(payments);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).send({ error: "Failed to fetch payment history." });
      }
    });
    app.get("/payments/:email", async (req, res) => {
      const email = req.params.email;

      try {
        const payments = await paymentsCollection
          .find({ email }) // Filter payments by user email
          .sort({ date: -1 }) // Sort by most recent payment
          .toArray();

        res.send(payments);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).send({ error: "Failed to fetch payment history." });
      }
    });
    app.post("/parcels", async (req, res) => {
      const parcelData = req.body;

      try {
        const result = await parcelsCollection.insertOne(parcelData);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to book parcel" });
      }
    });
    app.get("/parcels", async (req, res) => {
      const { email } = req.query;

      if (!email) {
        return res
          .status(400)
          .json({ error: "Email query parameter is required" });
      }

      try {
        const parcels = await parcelsCollection
          .find({ senderEmail: email })
          .toArray();
        res.status(200).json(parcels);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch parcels" });
      }
    });

    app.get("/parcel-services", async (req, res) => {
      const services = await parcelServicesCollection.find().toArray();
      res.send(services);
    });

    app.get("/api/statistics", async (req, res) => {
      try {
        const totalParcels = await parcelsCollection.countDocuments();
        const deliveredParcels = await parcelsCollection.countDocuments({
          status: "delivered",
        });
        const totalUsers = await usersCollection.countDocuments();

        res.status(200).send({ totalParcels, deliveredParcels, totalUsers });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch statistics", error });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Run the database connection
run().catch(console.dir);

// Base Route
app.get("/", (req, res) => {
  res.send("Parcel Management API is running...");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
