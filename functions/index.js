const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
app.use(cors({ origin: true }));

//Routes
// app.get('/hello-world', (req, res) => {
//     return res.status(200).send('Hello biches!!')
// })

//GET all blogposts
const getAllPosts = async (req, res) => {
  try {
    const blogpostsRef = db.collection("blogposts");
    const snapshot = await blogpostsRef.get();

    const blogposts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(blogposts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

app.get("/blogposts", getAllPosts);

// test

//CREATE a blogpost
//POST
const createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlogPost = {
      title,
      content,
    };
    await db.collection("blogposts").add(newBlogPost);

    return res.status(201).json({ message: "Blog post created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
app.post("/create", createBlogPost);

//READ a specific product based on id
//GET by ID
const getBlogById = async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const blogPostRef = db.collection("blogposts").doc(blogPostId);
    const doc = await blogPostRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const blogPostData = doc.data();
    return res.status(200).json(blogPostData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
app.get("/blogposts/:id", getBlogById);

// UPDATE a specific blog post based on ID
// PUT
const updateBlogById = async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const { title, content } = req.body;

    const blogPostRef = db.collection("blogposts").doc(blogPostId);
    const doc = await blogPostRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const updatedFields = {
      ...(title && { title }),
      ...(content && { content }),
    };

    await blogPostRef.update(updatedFields);

    return res.status(200).json({ message: "Blog post updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

app.put("/blogposts/:id", updateBlogById);

//DELETE
const deleteBlogById = async (req, res) => {
  try {
    const blogPostId = req.params.id;

    const blogPostRef = db.collection("blogposts").doc(blogPostId);
    const doc = await blogPostRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    await blogPostRef.delete();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
app.delete("/blogposts/:id", deleteBlogById);

exports.api = functions.https.onRequest(app);
