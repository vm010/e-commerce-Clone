const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});
const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
