import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const SearchBox = () => {
	// The useHistory method is brought in because SearchBox will not have access to the history prop by default since it is embedded within another component. useHistory prevents having to do other workarounds or having to prop-drill while using Redux as well.
	const history = useHistory();
	const [keyword, setKeyword] = useState('');

	const submitHandler = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			history.push(`/search/${keyword}`);
		} else {
			history.push('/');
		}
	};
	return (
		<Form onSubmit={submitHandler} inline>
			<Form.Control
				type='text'
				name='q'
				onChange={(e) => setKeyword(e.target.value)}
				placeholder='Search Products...'
				className='mr-sm-2 ml-sm-5'
			></Form.Control>
			<Button type='submit' variant='outline-success' className='p-2'>
				Search
			</Button>
		</Form>
	);
};

export default SearchBox;
