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

userSchema.methods.matchPassword = async function(enteredPassword) {
	// You can use this.password here because this method is called on a specific user object so the 'this' here will refer to that user object, which contains a password property
	return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema);

export default User;
