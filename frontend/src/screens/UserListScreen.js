import { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import Message from '../components/Message.js';
import Loader from '../components/Loader.js';
import { listUsers } from '../actions/userActions.js';

const UserListScreen = () => {
	const dispatch = useDispatch();

	const userList = useSelector((state) => state.userList);
	const { loading, error, users } = userList;

	useEffect(() => {
		dispatch(listUsers());
	}, [dispatch]);

	const deleteHandler = (id) => {
		console.log(id, 'deleted');
	};

	return (
		<>
			<h1>Users</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td>
									{user.isAdmin ? (
										<FaCheck style={{ color: 'green' }} />
									) : (
										<FaTimes style={{ color: 'red' }} />
									)}
								</td>
								<td>
									<LinkContainer to={`user/${user._id}/edit`}>
										<Button variant='light' className='btn-sm'>
											<FaEdit />
										</Button>
									</LinkContainer>
									<Button
										variant='danger'
										className='btn-sm'
										onClick={() => deleteHandler(user._id)}
									>
										<FaTrash />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default UserListScreen;
