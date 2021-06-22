import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
} from 'react-bootstrap';
import Message from '../components/Message.js';
import { addToCart } from '../actions/cartActions.js';

const CartScreen = ({ match, location, history }) => {
	const productId = match.params.id;

	// Here we are grabbing the query parameter(anything after the ? in a route), here it will be ?qty=x, and setting the quantity in the cart to the number(x) in that search query, else setting it to 1 if there is no search query.
	const qty = location.search ? Number(location.search.split('=')[1]) : 1;

	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;

	useEffect(() => {
		if (productId) {
			dispatch(addToCart(productId, qty));
		}
	}, [dispatch, productId, qty]);
	return <div>Cart</div>;
};

export default CartScreen;
