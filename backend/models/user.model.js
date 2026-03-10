import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, 'please add username'],
      unique:true
    }, 
    password: {
      type: String,
      required: [true, 'please add a password']
    },
    refreshToken: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema);

export default User;