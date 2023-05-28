import { comparePassword, hashPassword } from "../helper/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      res.send({ message: "Name is Required" });
    }
    if (!email) {
      res.send({ message: "Email is Required" });
    }
    if (!phone) {
      res.send({ message: "Phone  no is Required" });
    }
    if (!password) {
      res.send({ message: "Password is Required" });
    }
    if (!address) {
      res.send({ message: "Address is Required" });
    }
    if (!answer) {
      res.send({ message: "Answer is Required" });
    }
    //
    //existing user
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Register please login",
      });
    }
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register successfully",
      user,
    });


  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    //validation
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        messsage: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "Email is not registered", success: false });
    }
    //check user

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Password" });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body
    if (!email) {
      res.status(400).send({ message: "Email is required" })
    }

    if (!answer) {
      res.status(400).send({ message: "answer is required" })
    }

    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" })
    }

    //check
    const user = await userModel.findOne({ email, answer })

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer"
      })
    }

    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id, { password: hashed })
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully "
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: true,
      message: "Something went wrong",
      error
    })
  }
}


export const testController = (req, res) => {
  console.log("Protected route");
  res.send("Protected Route");
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body
    const user = await userModel.findById(req.user._id)
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 charater long" })
    }

    const hashedPassword = password ? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
      name: name || user.name,
      password: hashedPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address
    }, { new: true })
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser
    })
  } catch (error) {
    console.log(error)
    res.status(200).send({
      success: false,
      message: "Error while update profile",
      error
    })
  }
}


///get Orders
//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
    res.json(orders)

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while Getting Orders",
      error
    })
  }
}

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: "-1" })
    res.json(orders)

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while Getting Orders",
      error
    })
  }
}

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
    res.json(orders)

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while Updating Order",
      error
    })

  }
}
