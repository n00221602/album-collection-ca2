import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    }
  },
  { _id: true }
);

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    releases: [albumSchema],
    bio: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

artistSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
    delete returnedObject.userId;
  },
});

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
