import axios from 'axios';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants.js';
import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_REGISTER_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_DETAILS_FAIL,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_UPDATE_PROFILE_FAIL,
	USER_UPDATE_PROFILE_REQUEST,
	USER_UPDATE_PROFILE_SUCCESS,
	USER_UPDATE_PROFILE_RESET,
	USER_DETAILS_RESET,
	USER_LIST_REQUEST,
	USER_LIST_SUCCESS,
	USER_LIST_FAIL,
	USER_LIST_RESET,
	USER_DELETE_REQUEST,
	USER_DELETE_SUCCESS,
	USER_DELETE_FAIL,
	USER_UPDATE_REQUEST,
	USER_UPDATE_SUCCESS,
	USER_UPDATE_FAIL,
} from '../constants/userConstants.js';

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		// If I understand this correctly, here we are pulling the data object from the response to the axios post request and setting it equal to a constant we call data. The data object in the response is the user's information in the database, provided by the authUser method in the userController.
		const { data } = await axios.post(
			'/api/users/login',
			{ email, password },
			config
		);

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const logout = () => (dispatch) => {
	localStorage.removeItem('userInfo');
	dispatch({ type: USER_DETAILS_RESET });
	dispatch({ type: USER_UPDATE_PROFILE_RESET });
	dispatch({ type: ORDER_LIST_MY_RESET });
	dispatch({ type: USER_LIST_RESET });
	dispatch({ type: USER_LOGOUT });
};

export const register = (name, email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_REGISTER_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		// If I understand this correctly, here we are pulling the data object from the response to the axios post request and setting it equal to a constant we call data. The data object in the response is the user's information in the database, provided by the authUser method in the userController.
		const { data } = await axios.post(
			'/api/users',
			{ name, email, password },
			config
		);

		dispatch({
			type: USER_REGISTER_SUCCESS,
			payload: data,
		});

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getUserDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
		});

		// getState will grab all the state present and here we destructure two levels of state to obtain the userInfo. (I believe this would look like getState().userLogin.userInfo without destructuring.) This is done to obtain the user's token to access the protected updateUserProfile route.
		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/users/${id}`, config);

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(`/api/users/profile`, user, config);

		dispatch({
			type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const listUsers = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_LIST_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get('/api/users', config);

		dispatch({
			type: USER_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.response,
		});
	}
};

export const deleteUser = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DELETE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await axios.delete(`/api/users/${id}`, config);

		dispatch({
			type: USER_DELETE_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: USER_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.response,
		});
	}
};

export const updateUser = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(`/api/users/${user._id}`, user, config);

		dispatch({
			type: USER_UPDATE_SUCCESS,
		});
		// dispach to user details is done to propogate the user's updated details down into the userDetails state so it can be viewed immediately rather than on an unrelated reload.
		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: USER_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.response,
		});
	}
};
