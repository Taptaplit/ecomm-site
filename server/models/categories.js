const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    cName: {
      type: String,
      required: true,
    },
    aName: {
      type: String,
      required: true,
    },
    cDescription: {
      type: String,
      required: true,
    },
    aDescription: {
      type: String,
      required: true,
    },
    cSubCategory: {
      type: Array,
      required: true,
    },
    aSubCategory: {
      type: Array,
      required: true,
    },
    cImage: {
      type: String,
    },
    cStatus: {
      type: String,
      required: true,
    },
    cType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
