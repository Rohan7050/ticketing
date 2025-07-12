import React, {useState} from'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: (response) => {
            Router.push('/');
        }
    })

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }


    const onBlur = () => {
        const CurPrice = parseFloat(price);
        console.log(CurPrice);
        if(isNaN(CurPrice) || CurPrice <= 0) {
            return;
        }
        setPrice(CurPrice.toFixed(2));
    }
    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" type="text" />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input value={price} onBlur={onBlur} onChange={(e) => setPrice(e.target.value)} className="form-control" type="number" />
                </div>
                {errors}
                <button className="btn btn-primary mt-3">Submit</button>
            </form>
        </div>
    )
}

export default NewTicket;