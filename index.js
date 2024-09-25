const port = 4000;
const express = require('express');
const app = express();

// import package
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const path = require('path');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { type } = require('os');
const fs = require("fs");
const { timeStamp } = require('console');
// use package for our app
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cors());
// Database connection with MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Helal");


app.set('view engine', 'ejs');
// Set the views directory (optional, defaults to 'views')  
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    console.log(`Request method: ${req.method}`);
    next();
});
// API Creation
app.get('/', async (req, res) => {
    let page;
    if(req.body.page){
        page = req.body.page;
    }else{
        page = 1;
    }
    let perPage = 10;
    let offset = (page - 1) * perPage;
    let majorProducts = await Product.find({type: "major"}).skip(offset).limit(perPage);
    let wholesells = await Product.find({type : "single"}).skip(offset).limit(perPage);
    let contents = await Contents.find({});
    let satisfictions = await Satisfictions.find({}).sort({ date: -1 }).limit(3);
    res.render('index', { majorProducts, wholesells, contents , satisfictions});
})

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        // console.log(file);
        
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });

const change = multer({
    dest: 'upload/images', // Upload folder
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'), false);
      }
    }
  });

// Creating upload endpoint for images
// use static path
app.use('/images', express.static('upload/images'));
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for Creating Products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    salesPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    available: {
        type: Boolean,
        default: true
    },
});
// major products page sells 
app.get("/admin/major", async (req, res) => {
    try {
        let products = await Product.find({ type: "major" });
        res.render('admin/pages/major', { products: products });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// add a new product by admin
app.get("/admin/addProduct", (req, res) => {
    res.render('admin/pages/addProducts');
});
// single products page sells
app.get("/admin/single", async(req, res) => {
    try {
        let products = await Product.find({ type: "single" });
        res.render('admin/pages/single', { products: products });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// sales list 
app.get("/admin/sales", (req, res) => {
    res.render('admin/pages/sales');
});
app.get("/admin/content", async(req, res) => {
    res.render('admin/pages/content');
});


app.post('/admin/changeContent', change.single('newImage'), (req, res) => {
    const selectedImage = req.body.imageSelect;
    const newImageFile = req.file;
  
    if (newImageFile) {
      const oldImagePath = path.join(__dirname, 'upload/images', selectedImage);
      const newImagePath = path.join(__dirname, 'upload/images', selectedImage);
  
      // Remove old image if it exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
  
      // Rename new image to the old image's name
      fs.renameSync(newImageFile.path, newImagePath);
  
      res.redirect("/admin/content");
    } else {
      res.send('No file uploaded.');
    }
  });


// app.get("/admin/contentShow", async(req, res) => {
//     let contents = await Contents.find({});
//     console.log(contents);
//     res.send({
//         contents : contents
//     })
// });
// app.delete("/admin/deleteContent/:id" , async(req , res)=>{
//     try {
//         const { id } = req.params;
    
//         // Find and delete the product
//         const result = await Contents.findByIdAndDelete(id);
    
//         if (!result) {
//           console.log("failed deleted");
//           return res.status(404).send('Product not found');
//         }
//         res.status(200).send('Content deleted successfully');
//       } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//       }
// })

app.get("/admin/satisfiction", (req, res) => {
    res.render('admin/pages/satisfiction');
});
const Satisfictions = mongoose.model("Satisfictions", {
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }, 
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});
app.post("/admin/satisfiction",upload.single('image'), async(req, res) => {
    const satisfiction = new Satisfictions({
        id : mongoose.Schema.Types.ObjectId,
        title : req.body.title,
        description: req.body.description,
        image: req.file.filename, // Store the file path or URL
    });
    await satisfiction.save();
    console.log("satistication saved");
    res.redirect('/admin/satisfiction');
});

// app.post("/admin/addContent" , async(req , res)=>{
//     const content = new Contents({
//         image1 : "image1.jpg",
//         image2 : "image2.jpg",
//         image3 : "image3.jpg",
//         image4 : "image4.jpg",
//         image5 : "image5.jpg",
//         image6 : "image6.jpg"
//     })
//     await content.save();
//     console.log("contents saved");
//     res.send("content saved");
// })
const Contents = mongoose.model("Contents", {
    image1: {
        type: String,
    },
    image2: {
        type: String,
    },
    image2: {
        type: String,
    },
    image3: {
        type: String,
    },
    image4: {
        type: String,
    },
    image5: {
        type: String,
    },
    image6: {
        type: String,
    },
});

app.put("/admin/content/66c5c947882307aa0ad50cbb",upload.single('image'), async(req, res) => {
    var content;
    var nameContent = req.body.nameContent;
    if(nameContent == "first"){
         content = new Contents({
            id : mongoose.Schema.Types.ObjectId,
            image1: req.file.filename, // Store the file path or URL
        });
    }else if(nameContent == "second"){
         content = new Contents({
            id : mongoose.Schema.Types.ObjectId,
            image2: req.file.filename, // Store the file path or URL
        });
    }else if(nameContent == "third"){
         content = new Contents({
            id : mongoose.Schema.Types.ObjectId,
            image3: req.file.filename, // Store the file path or URL
        });
    }else if(nameContent == "fourth"){
         content = new Contents({
            id : mongoose.Schema.Types.ObjectId,
            image4: req.file.filename, // Store the file path or URL
        });
    }else if(nameContent == "fifth"){
         content = new Contents({
            id : mongoose.Schema.Types.ObjectId,
            image5: req.file.filename, // Store the file path or URL
        });
    }else if(nameContent == "sixth"){
         content = new Contents({
            id : mongoose.Schema.Types.ObjectId,
            image6: req.file.filename, // Store the file path or URL
        });
    }
    await content.save();
    console.log("content saved");
    res.redirect('/admin/content');
});


app.post('/admin/addProduct', upload.single('image'), async (req, res) => {

    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        number: req.body.number,
        image: req.file.filename, // Store the file path or URL
        type: req.body.type,
        category: req.body.category,
        salesPrice: req.body.salesPrice
    });
    await product.save();
    console.log("Product saved");
    res.redirect('/admin/addProduct');
});


// API for deleteing major products
app.delete('/admin/removeMajorProduct/:id', async (req, res) => {   
    try {
        const { id } = req.params;
    
        // Find and delete the product
        const result = await Product.findByIdAndDelete(id);
    
        if (!result) {
          console.log("failed deleted");
          return res.status(404).send('Product not found');
        }
    
        res.status(200).send('Product deleted successfully');
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
      }
});

// // API for deleteing single products
// app.post('/removeSingleProduct', async (req, res) => {
//     await Product.findOneAndDelete({ id: req.body.id });
//     console.log("Removed Product");
//     res.redirect(800,"/admin/single");
// });

// Creating API for getting all products
app.get('/allProducts', async (req, res) => {
    let products = await Product.find({});
    console.log('All Products Fetched');
    res.send(products);
});

// creating API for getting product by id
app.get('/fetchProductById/:id', async (req, res) => {
    const id = req.params.id;
    let product = await Product.findOne({ id: id });
    if (!product) {
        res.status(404).json({ errors: "Product not found" });
    }
    console.log('Product Fetched');
    res.send(product);
});

// creating API to edit product by id
app.put('/updateProduct/:id', async (req, res) => {
    const id = req.params.id;
    let existProduct = await Product.findOne({ id: id });
    if (!existProduct) {
        res.status(404).json({ errors: "Product not found" });
    }
    existProduct.name = req.body.name ?? existProduct.name;
    existProduct.category = req.body.category ?? existProduct.category;
    existProduct.new_price = req.body.new_price ?? existProduct.new_price;
    existProduct.old_price = req.body.old_price ?? existProduct.old_price;
    existProduct.image = req.body.image ?? existProduct.image;
    existProduct.productType = req.body.productType;

    await existProduct.save();
    console.log("Product updated");
    res.json({
        success: 1,
        name: req.body.name
    });

})

// Schema creating for User model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

// Creating endpoint for registering the user
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    });

    await user.save();
    const data = {
        usre: {
            id: user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

// creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong Password" })
        }
    } else {
        res.json({ success: false, errrors: "User not found with this email address" })
    }
});

// creating endpoint newCollection data
app.get('/newCollection', async (req, res) => {
    let product = await Product.find({});
    // this double slice array method use to get the last 8 product from database
    let newCollection = product.slice(1).slice(-8);
    console.log("New Collection Fetched");
    res.send(newCollection);
});

// creating endpoint for popular in women section
app.get('/popularInWomen', async (req, res) => {
    let product = await Product.find({ category: "women" });
    let popularInWomen = product.slice(0, 4);
    console.log("Popular in women Fetched");
    res.send(popularInWomen);
});

// creating endpoint for adding product in Cart data
app.post('/relatedProducts', async (req, res) => {
    console.log(req.body);
    let product = await Product.find({ category: req.body.category });
    let relatedProducts = product.slice(0, 4);
    console.log("Related Products Fetched");
    res.send(relatedProducts);
});

// creating middleWare to fetch use
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using a valid token" })
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "please authenticate using a valid token" })
        }
    }
}

// // creating endpoint for adding product in Cart data
// app.post('/addToCart', fetchUser, async (req, res) => {
//     // console.log(req.body.itemId, req.user);
//     console.log("Added", req.body.itemId);
//     let userData = await Users.findOne({ _id: req.user.id });
//     userData.cartData[req.body.itemId] += 1;
//     await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//     res.send({ errors: "Added" });
// });

// creating endpoint for adding product in Cart data
app.post('/removeFromCart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send({ errors: "Removed" });
});

// creating endpoint to get Cart data
app.post('/getCart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
    console.log("cartData Fetched");
})


// API Listening
app.listen(port, (error) => {
    if (!error) {
        console.log('Server Running on port: ' + port);
    } else {
        console.log("Error" + error);
    }
})
