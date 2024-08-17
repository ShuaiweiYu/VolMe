import { UserModel } from '../models/user/User.js';
import { Organizer, OrganizerModel } from '../models/user/Organizer.js';
import { Volunteer, VolunteerModel } from '../models/user/Volunteer.js';
import {CodeModel} from '../models/util/Code.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import {WishlistItemModel} from "../models/util/WishlistItem.js";

// @desc Get all users
// @route GET /users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find().select('-password')

    // If no users
    if (!users?.length) {
        return res.status(400).json({message: 'No users found'})
    }

    res.json(users)
})

// @desc Get a user by email address
// @route GET /users/:emailAddress
const getUserByEmailAddress = asyncHandler(async (req, res) => {
    const {emailAddress} = req.params

    const user = await UserModel.findOne({ emailAddress }).select('_id emailAddress username');

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({message: 'User not found'})
    }
})

// @desc Get a user by email address
// @route GET /users/id/:userId
const getUserById = asyncHandler(async (req, res) => {
    const {userId} = req.params

    const user = await UserModel.findById(userId).select('-hashedPassword')

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({message: 'User not found'})
    }
})

// @desc Update user's isValidUser attribute
// @route PUT /users/validate/:userId
const validateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { isValidUser } = req.body;

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
        user.isValidUser = isValidUser
        const updatedUser = await user.save();
        res.status(200).json({message: 'Validation Success'});
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc Update user's information
// @route PUT /users/:userId
const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
        Object.assign(user, updateData);
        const updatedUser = await user.save();

        res.status(200).json({message: 'Update Success'});
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc Update user's credential
// @route PUT /users/credential/:userId
const updateUserCredential = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { password, secret } = req.body;

    const code = await CodeModel.findOne({ assignTo: userId, secret: secret });

    const user = await UserModel.findById(userId);

    if (!code) {
        res.status(403).json({ message: 'Forbidden' });
    }

    if (user) {
        const hashedPwd = await bcrypt.hash(password, 10)
        user.hashedPassword = hashedPwd
        const updatedUser = await user.save();
        res.status(200).json({message: 'Update Success'});
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc Delete a user
// @route DELETE /users/id/:userId
const deleteUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Extract the user ID from the request params

    // Confirm that the ID is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    // Check if the user exists in the database
    const user = await UserModel.findById(userId).exec();

    // If the user does not exist, return an error message
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    const result = await user.deleteOne();

    await WishlistItemModel.deleteMany({ user: id });

    // Create a response message
    const reply = `Username ${result.response.username} with ID ${result.response._id} deleted`;

    // Send the response back to the client
    res.json({ message: reply });
});

// @desc Create a new organizer
// @route POST /users/organizers
const createNewOrganizer = asyncHandler(async (req, res) => {
    const {emailAddress, username, password, profilePicturePath, address, phoneNumber, country, state, city, postalCode} = req.body

    // Confirm data
    if (!emailAddress || !username || !password || !profilePicturePath || !address || !country || !state || !city ||!postalCode) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicate emailAddress
    const duplicate = await UserModel.findOne({emailAddress})

    if (duplicate) {
        return res.status(409).json({message: 'Duplicate emailAddress'})
    }

    // Hash Password
    const hashedPwd = await bcrypt.hash(password, 10)

    const organizerObj = new Organizer(emailAddress, username, hashedPwd)
    organizerObj.organizationName = username
    organizerObj.profilePicturePath = profilePicturePath
    organizerObj.phoneNumber = phoneNumber
    organizerObj.address = address
    organizerObj.country = country
    organizerObj.state = state
    organizerObj.city = city
    organizerObj.postalCode = postalCode

    // Create and store new user
    const organizer = await OrganizerModel.create(organizerObj)

    if (organizer) { //created
        res.status(201).json(organizer)
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }
})

// @desc Create new a volunteer
// @route POST /users/volunteers
const createNewVolunteer = asyncHandler(async (req, res) => {
    const {emailAddress, username, password, profilePicturePath, firstname, lastname, birthday, phoneNumber} = req.body

    // Confirm data
    if (!emailAddress || !username || !password || !profilePicturePath || !firstname || !lastname) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicate emailAddress
    const duplicate = await UserModel.findOne({emailAddress})

    if (duplicate) {
        return res.status(409).json({message: 'Duplicate emailAddress'})
    }

    // Hash Password
    const hashedPwd = await bcrypt.hash(password, 10)

    const volunteerObj = new Volunteer(emailAddress, username, hashedPwd)
    volunteerObj.firstname = firstname
    volunteerObj.lastname = lastname
    volunteerObj.birthday = birthday
    volunteerObj.phoneNumber = phoneNumber

    // Create and store new user
    const volunteer = await VolunteerModel.create(volunteerObj)

    if (volunteer) { //created
        res.status(201).json(volunteer)
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }
})

export default {
    getAllUsers,
    getUserByEmailAddress,
    getUserById,
    updateUser,
    validateUser,
    updateUserCredential,
    deleteUserById,
    createNewOrganizer,
    createNewVolunteer
}