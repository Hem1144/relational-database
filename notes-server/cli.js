require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");

const express = require("express");
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blog extends Model {}

Blog.init(
  {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: "URL must be a valid URL",
        },
        notEmpty: {
          msg: "URL cannot be empty",
        },
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

async function printBlogs() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    const blogs = await Blog.findAll();

    console.log("Blogs:");
    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

printBlogs();

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.get("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).send("No data found");
  }
});

app.post("/api/blogs", async (req, res) => {
  const { author, title, url, likes } = req.body;
  try {
    const newBlog = await Blog.create({ author, title, url, likes });
    res.json(newBlog);
  } catch (error) {
    res.status(500).send("Error creating blog");
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, likes } = req.body;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    await blog.update({ author, title, likes });
    res.json(blog);
  } catch (error) {
    res.status(500).send("Error updating blog");
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    await blog.destroy();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting blog");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
