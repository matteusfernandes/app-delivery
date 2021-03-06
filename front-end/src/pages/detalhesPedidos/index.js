import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import api from '../../api';
import Header from '../../components/header';
import Button from '../../components/button';
import Table from '../../components/table';
import './style.css';

function PedidosClienteDetalhes() {
  const loggedUser = useSelector((state) => state.user);
  const [seller, SetSeller] = useState(null);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const { id } = useParams();
  let prefix = 'customer_order_details';
  const deliveryStatus = {
    preparing: 'Preparando',
    dispatch: 'Em Trânsito',
    delivery: 'Entregue',
    pending: 'Pendente',
  };

  const handleClick = ({ target: { name } }) => {
    let data = {};

    switch (name) {
    case 'preparing':
      data = { status: deliveryStatus.preparing };
      break;

    case 'dispatch':
      data = { status: deliveryStatus.dispatch };
      break;

    default:
      data = { status: deliveryStatus.delivery };
      break;
    }

    api.put(`/order/customer/update/${id}`, data,
      { headers: { Authorization: loggedUser.token } })
      .then((response) => setStatus(response.data.status))
      .catch((error) => console.log(error.response.data));
  };

  useEffect(() => {
    api.get(`/order/customer/order/${id}`,
      { headers: { Authorization: loggedUser.token } })
      .then((data) => {
        setOrder(data.data);
        setStatus(data.data.status);

        api.get(`/sales/user/seller/${data.data.sellerId}`,
          { headers: { Authorization: loggedUser.token } })
          .then((response) => {
            SetSeller(response.data.name);
          });
      })
      .catch((error) => console.log(error.response.data));
  }, [loggedUser, id]);

  if (loggedUser.role === 'seller') {
    prefix = 'seller_order_details';
  }

  return (
    <>
      <Header />
      <div className='container-order-details'>
      <h2>Detalhes do Pedido</h2>
        <nav>
          <p
            data-testid={ `${prefix}__element-order-details-label-order-id` }
          >
            {`Pedido ${id}`}
          </p>
          <p
            data-testid={ `${prefix}__element-order-details-label-seller-name` }
          >
            {loggedUser.role === 'customer' && `P. Vend: ${seller}`}
          </p>
          <p
            data-testid={ `${prefix}__element-order-details-label-order-date` }
          >
            { order && moment(order.saleDate).format('DD/MM/YYYY') }
          </p>
          <p
            data-testid={ `${prefix}__element-order-details-label-delivery-status` }
          >
            { status }
          </p>
          { loggedUser.role === 'customer' && (
            <Button
              label="MARCAR COMO ENTREGUE"
              name="delivery"
              id="delivery-btn"
              testid={ `${prefix}__button-delivery-check` }
              onClick={ handleClick }
              value={
                status === deliveryStatus.preparing
                || status === deliveryStatus.pending
                || status === deliveryStatus.delivery
              }
            />
          )}
          { loggedUser.role === 'seller' && (
            <div>
              <Button
                label="PREPARAR PEDIDO"
                name="preparing"
                id="preparing-btn"
                testid={ `${prefix}__button-preparing-check` }
                onClick={ handleClick }
                value={
                  status === deliveryStatus.preparing
                  || status === deliveryStatus.delivery
                  || status === deliveryStatus.dispatch
                }
              />
              <Button
                label="SAIU PARA ENTREGA"
                name="dispatch"
                id="dispatch-btn"
                testid={ `${prefix}__button-dispatch-check` }
                onClick={ handleClick }
                value={
                  status === deliveryStatus.delivery
                  || status === deliveryStatus.dispatch
                  || status === deliveryStatus.pending
                }
              />
            </div>
          )}
        </nav>
        {order && <Table
          prefix
          order={ order }
        />}
        <p
          classname='details-total' data-testid={ `${prefix}__element-order-total-price` }
        >
          { `Total: $${order && (order.totalPrice.replace('.', ','))}` }
        </p>
      </div>
    </>
  );
}

export default PedidosClienteDetalhes;
