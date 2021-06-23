import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
	// You can use this.password here because this method is called on a specific user object so the 'this' here will refer to that user object, which contains a password property
	return await bcrypt.compare(enteredPassword, this.password);
};

// By adding .pre, this function will run before anything is saved to the user database. There is no need to call this into the user controller or anything else. The encryption check will run every time before save. This includes when first creating a user with User.create since save follows creation when .create is called.
userSchema.pre('save', async function (next) {
	// isModified is a mongoose method that checks if something has been changed. Here it checks to see if the user's password has already been encrypted. If the password has been modified(i.e. encrypted), then next() is called to skip the password hashing below. Without this the user's already hashed password may be hashed again, preventing an existing user form logging in.
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
