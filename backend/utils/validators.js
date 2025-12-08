import mongoose from "mongoose";

//Album validators
export const albumSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title must be a string",
    },
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  genre: {
    in: ["body"],
    isArray:{
      errorMessage: "Genre must be an array",
    },
    notEmpty: {
      errorMessage: "Genre is required",
    },
  },
  year: {
    in: ["body"],
    isInt: {
      options: { min: 1900, max: 2025 },
    },
    notEmpty: {
      errorMessage: "Year is required and must be between 1900 and 2025",
    },
  },
};

export const albumIdSchema = {
  id: {
    in: ["params"],
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: "Album ID 'id' parameter must be a valid ObjectId",
    },
  },
};

//Artist validators
export const artistSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  releases: {
    in: ["body"],
    isArray: {
      errorMessage: "Releases must be an array",
    },
    notEmpty: {
      errorMessage: "Releases is required",
    },
  },
  bio: {
    in: ["body"],
    isString: {
      errorMessage: "Bio must be a string",
    },
    notEmpty: {
      errorMessage: "Bio is required",
    },
  },
};

export const artistIdSchema = {
  id: {
    in: ["params"],
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: "Artist ID 'id' parameter must be a valid ObjectId",
    },
  },
};

//Review validators
export const reviewSchema = {
  rating: {
    in: ["body"],
    isInt: {
      options: { min: 0, max: 10 },
      errorMessage: "Rating must be an integer between 0 and 10",
    },
    notEmpty: {
      errorMessage: "Rating is required",
    },
  },
  comment: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Comment must be a string",
    },
  },
};

export const reviewIdSchema = {
  id: {
    in: ["params"],
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: "Review ID 'id' parameter must be a valid ObjectId",
    },
  },
};

//Auth validators
export const registerSchema = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'name' field is required",
    },
    isString: {
      errorMessage: "'name' field must be a valid name address",
    },
  },
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'email' field is required",
    },
    isEmail: {
      errorMessage: "'email' field must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'password' field is required",
    },
    isStrongPassword: {
      options: {
        minLength: 8,
        minSymbols: 0,
        minUpperCase: 1,
        minNumbers: 1,
      },
      errorMessage:
        "'password' field must be 8 characters long, contain at least one upper case character and one number",
    },
  },
};

export const loginSchema = {
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'email' field is required",
    },
    isEmail: {
      errorMessage: "'email' field must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'password' field is required",
    },
    isString: {
      errorMessage: "'password' field must be a valid string",
    },
  },
};
