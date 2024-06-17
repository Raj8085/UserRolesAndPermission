require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/user-roles-perm");
console.log("Mongodb connected")

app.use(express.static("public"));
app.use(express.json());
const port =   3001;

//AUTHROUTE
const authRoute = require("./routes/authRoute");
app.use("/api",authRoute);

//ADMINROUTE
const adminRoute = require("./routes/adminRoute");
app.use("/api/admin",adminRoute);

//COMMON ROUTE
const commonRoute = require("./routes/commonRoute");
app.use("/api",commonRoute);


const auth = require("./middlewares/authmiddleware");
const {onlyAdminAccess} = require("./middlewares/adminMiddleware")
const {getAllRoutes} = require("./controllers/admin/routerController")

app.get("/api/admin/all-routes", auth ,onlyAdminAccess,getAllRoutes)
 

app.listen(port,()=>console.log(`Server started at PORT ${port}`))



 