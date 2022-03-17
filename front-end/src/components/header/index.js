import React from 'react';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setUser } from '../../app/slices/user';
import { deleteCart } from '../../app/slices/cart';
import { setTotal } from '../../app/slices/totalPrice';
import helpers from '../../helpers';
import Button from '../button';

const DEFAULT_USER = {
  id: null,
  name: null,
  email: null,
  role: null,
  token: null,
};

function Header() {
  const loggedUser = useSelector((state) => state.user);
  const { userName, role } = loggedUser;
  const dispatch = useDispatch();

  const handleLogout = () => {
    helpers.removeStorage();
    dispatch(setUser(DEFAULT_USER));
    dispatch(deleteCart());
    dispatch(setTotal(null));
  };

  return (
    <header className='top-header'>
      <nav className='nav-header'>
        { role === 'customer' && (
          <div className='left-header'>
            <div className='products-link' data-testid="customer_products__element-navbar-link-products">
              <Link to="/customer/products">
                PRODUTOS
              </Link>
            </div>
            <div className='orders-link' data-testid="customer_products__element-navbar-link-orders">
              <Link to="/customer/orders">
                <p className='my-orders'>MEUS PEDIDOS</p>
              </Link>
            </div>
          </div>
        )}
        { role === 'seller' && (
          <div data-testid="customer_products__element-navbar-link-orders">
            <Link to="/seller/orders">
              PEDIDOS
            </Link>
          </div>
        )}
        <div className='right-header'>
          <div className='username' data-testid="customer_products__element-navbar-user-full-name">
            { userName }
          </div>
          <Link to="/login">
            <Button
              label="SAIR"
              name="logout-btn"
              id="logout-btn"
              testid="customer_products__element-navbar-link-logout"
              onClick={ handleLogout }
              value={ false }
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
