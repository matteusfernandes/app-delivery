import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import api from '../../api';
import Button from '../../components/button';
import Input from '../../components/input';
import './style.css';
import Header from '../../components/header';

function Checkout() {
  const cart = useSelector((state) => state.cart);
  const price = useSelector((state) => state.totalPrice.totalPrice);
  const token = useSelector((state) => state.user.token);
  const [vendedores, setVendedores] = useState([]);
  const [IdSeller, setIdSeller] = useState(0);
  const [endereço, setEndereço] = useState('');
  const [numero, setNumero] = useState('');
  const [saleId, setSaleId] = useState('');
  const [array, setArray] = useState(cart);
  const [totalPrice, setTotalPrice] = useState(price);
  const history = useHistory();

  useEffect(() => {
    api.get('/sales/user')
      .then((response) => {
        setVendedores(response.data);
      })
      .catch((err) => (err.response.data));
  }, []);

  const header = {
    headers: {
      Authorization: token,
    },
  };

  const createSale = async (data) => {
    await api.post('/customer/orders', data, header)
      .then((response) => {
        setSaleId(response.data);
      })
      .catch((err) => (err.response.data));
  };

  const onSubmitOrder = async (envet) => {
    envet.preventDefault();
    const products = array.map(({ id, quantity }) => {
      const productId = id;
      return { productId, quantity };
    });
    await createSale({
      totalPrice,
      deliveryAddress: endereço,
      deliveryNumber: numero,
      status: 'Pendente',
      sellerId: IdSeller,
      products,
    });
  };

  if (saleId.id) {
    history.push(`/customer/orders/${saleId.id}`);
  }

  const removeItem = (index) => {
    const itens = [...array];
    setTotalPrice((totalPrice - (itens[index].price * itens[index].quantity).toFixed(2)));
    itens.splice(index, 1);
    setArray(itens);
  };

  return (
    <div>
      <Header />
      <table>
        <caption>
          <h2>
            Finalizar Pedido
          </h2>
        </caption>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor</th>
            <th>Sub-total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {array.map((arr, i) => (
            <tr key={ i }>
              <td
                data-testid={ `customer_checkout__element-order-table-item-number-${i}` }
              >
                { i + 1 }
              </td>

              <td
                data-testid={ `customer_checkout__element-order-table-name-${i}` }
                className="product-title"
              >
                { arr.name }
              </td>

              <td
                data-testid={ `customer_checkout__element-order-table-quantity-${i}` }
                className="product-quantity"
              >
                { arr.quantity }
              </td>

              <td
                data-testid={ `customer_checkout__element-order-table-unit-price-${i}` }
                className="product-price"
              >
                { `R$ ${arr.price.replace('.', ',')}` }
              </td>

              <td
                data-testid={ `customer_checkout__element-order-table-sub-total-${i}` }
                className="product-line-price"
              >
                { `R$ ${Number(arr.price * arr.quantity).toFixed(2).replace('.', ',')}` }
              </td>

              <div>
                <Button
                  label="x"
                  name="Remover"
                  testid={ `customer_checkout__element-order-table-remove-${i}` }
                  onClick={ () => removeItem(i) }
                  value={ false }
                  id="btn-remove"
                  className="finish-order-btn"
                />
              </div>

            </tr>
          ))}
        </tbody>
      </table>
      <div className="totals-item">
        <p
          data-testid="customer_checkout__element-order-total-price"
        >
          {` Total: R$ ${Number(totalPrice).toFixed(2).replace('.', ',')}`}

        </p>
      </div>

      <form className="row" onSubmit={ onSubmitOrder }>
        <div className="col 50">
          <h3> Detalhes e Endereço para Entrega</h3>

          <label htmlFor="vendedores">
            P.Vendedora Responsavel

            <div>
              <select
                className="custom-select"
                id="vendedores"
                required
                value={ IdSeller }
                data-testid="customer_checkout__select-seller"
                onChange={ ({ target }) => setIdSeller(Number(target.value)) }
              >
                <option value=""> selecione o vendedor/a </option>
                {vendedores.map((vend, index) => (

                  <option
                    key={ index }
                    value={ vend.id }
                  >
                    { vend.name }

                  </option>

                ))}

              </select>
            </div>

          </label>

          <div className="fields">
            Endereço
            <Input
              type="text"
              label=""
              value={ endereço }
              name="endereço"
              onChange={ ({ target }) => setEndereço(target.value) }
              testid="customer_checkout__input-address"
            />
            Número
            <Input
              type="number"
              label=""
              value={ numero }
              name="numero"
              onChange={ ({ target }) => setNumero(target.value) }
              testid="customer_checkout__input-addressNumber"
            />
          </div>
            <Button
              label="FINALIZAR PEDIDO"
              name="FINALIZAR PEDIDO"
              testid="customer_checkout__button-submit-order"
              onClick={ onSubmitOrder }
              value={ false }
              id="btn-finish-order"
            />
        </div>


      </form>
    </div>
  );
}

export default Checkout;
