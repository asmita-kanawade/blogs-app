const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const mongoose = require("mongoose");
const BlogsModel = require("./model/blogsModel");
const BloggersModel = require("./model/bloggersModel");
const dotenv = require("dotenv");

dotenv.config();
mongoose.set("useFindAndModify", false);

// -- create server --
const app = express();

// -- use body parser middleware to parse the req body --
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//Render html
app.get('/', function (req, res) {

  console.log("inside app.get:/");

  fs.readFile("view/index.html", function (err, data) {
    res.send(data.toString())
  })
});

/***********************************************************************************************/
//Blogs api start here

//get all blogs
/*app.get('/api/search-blogs', async (req, res) => {

  console.log("inside app.get:/api/search-blogs");

  try {

    let blogs = await BlogsModel.find({}, null, { sort: {_id: 1} });

    //console.log(`Birthdays: ${birthdays}`);
    res.send(blogs);
    
  } catch (error) {

    console.log(`Search blogs Error: ${error}`);
    res.send(error);

  }
  
});
*/


/**--- Get/Search the Blog Posts ---*/
app.get('/api/search-blogs', async (req, res) => {

  console.log("inside /api/search-blogs");

  try {
    let conditions = req.body;

    let blogs = await BlogsModel.find(conditions, null, { sort: {title: 1} });

    //console.log(`Birthdays: ${birthdays}`);
    res.send(blogs);
    
  } catch (error) {

    console.log(`Search blogs Error: ${error}`);
    res.send(error);

  }
  
});



//-----add blog
app.post('/api/add-blog',  async (req, res) => {

  //receive data from client
  console.log("inside app.post:/add-blog");
  
  const blog = req.body;
  //console.log(`Question by post: ${JSON.stringify(question)}`);
  try {

    const blogSchema = new BlogsModel(blog);
 
    await blogSchema.save();
 
    //res.redirect(307, "/api/search-blogs");
    res.send(`Blog post saved with title ${blog.title}`);
 
  } catch (err) {
    console.log("error in post :"+ err);
    
    // res.redirect("/");
    res.send(`Error occurred while saving blog post: ${err}`);
  
  }

});
//---------update Blog
app.post('/api/update-blog',  async (req, res) => {

  console.log("inside /api/update-blog");
  
  const blogs = req.body;
  
  try {

    await BlogsModel.findByIdAndUpdate(blogs._id, 
      {
        title:blogs.title,
        body:blogs.body
      });

    // res.redirect(307, "/api/search-blogs")
    res.send("updated..!");
     
  } catch (err) {
 
    console.log(`Update Error: ${err}`);
    
    res.redirect("/");
  
  }
});

//-------Remove blog
app.post(`/api/delete-blog`, async (req, res) => {

  //receive data from client
  console.log("inside /api/delete-blog");
  
  const blog = req.body;
  //console.log(`Birthday by post: ${JSON.stringify(birthday)}`);

  try {

    await BlogsModel.findByIdAndRemove(blog._id);

   // res.redirect("307, /api/search-questions");
   res.send("deleted..!");
 
  } catch (err) {
    console.log(`Delete Error: ${err}`);
   // res.redirect("/");
   res.send("not deleted..its error..!")
  
  }

});
//blogs api end here
/***********************************************************************************************/

/** --- Login API --- */
app.post('/api/login', async (req, res) => {

  console.log("inside /api/login");

  let blogger = req.body;

  try {
    
    //check if user is already registered
    let bloggers = await BloggersModel.find(blogger);
    //console.log(`Existing bloggers: ${JSON.stringify(bloggers)}`);

    // if user is not already registered
    if(bloggers.length == 0)
    {
   
      res.send({
        status: `failed`,
        message: `Invalid username or password`,
        username: blogger.username
      });
  
    }
    else
      res.send({
        status: `success`,
        message: `Logged in`,
        username: blogger.username
      })
    
  } catch (error) {

    console.log(`Search creds Error: ${error}`);
    res.send("error");

  }
  
});


/** --- Signup/Registration API */
app.post('/api/signup',  async (req, res) => {
  //receive data from client
  console.log("inside /signup");
  
  const blogger = req.body;
  //console.log(`Birthday by post: ${JSON.stringify(birthday)}`);

  try {

    //check if user is already registered with same email
    let bloggers = await BloggersModel.find(blogger);
    //console.log(`Existing bloggers: ${JSON.stringify(bloggers)}`);
    
    // if user is not already registered
    if(bloggers.length == 0)
    {
      const bloggerSchema = new BloggersModel(blogger);
 
      await bloggerSchema.save();
   
      res.send({
        status: `success`,
        message: `Blogger registerd successfully`,
        username: blogger.username
      });
  
    }
    else
      res.send({
        status: `failed`,
        message: `Blogger already registered with username: ${blogger.username}`,
        username: blogger.username
      })
 
  } catch (err) {
 
    //res.redirect("/");
    console.log(`Error occurred while signing up. Error: ${err}`);
    
    res.send(`Error occurred while signing up. Error: ${err}`);  
  }

});


/***********************************************************************************************/

// --- connect to mongodb ---
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to mongoDB...");
});


// --- start the server ---
const PORT = process.env.PORT || 2001; 

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}...`);
});



