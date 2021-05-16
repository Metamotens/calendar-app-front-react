import React from 'react';
import { useDispatch } from 'react-redux';
import { uiOpenModal } from '../actions/ui';

export const AddNewFab = () => {
	const dispatch = useDispatch(uiOpenModal());

	const onClickEvent = (e) => {
		dispatch(uiOpenModal(e));
	};

	return (
		<div>
			<button className='btn btn-primary fab' onClick={onClickEvent}>
				<i className='fas fa-plus'></i>
			</button>
		</div>
	);
};
