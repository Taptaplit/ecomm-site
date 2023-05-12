const mongoose = require("mongoose");
try {
  mongoose.connect("mongodb+srv://Taptaplit10:Taptaplit10@cluster0.bgb1o.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("Database Connected Successfully");
} catch (err) {
  console.log("Database Not Connected");
}
