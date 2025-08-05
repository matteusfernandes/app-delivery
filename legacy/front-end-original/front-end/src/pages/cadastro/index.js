import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/button';
import Input from '../../components/input';
import { registerSchema } from '../../utils/schemas';
import schemaValidate from '../../utils/schemaValidate';
import api from '../../api';
import helper from '../../helpers';
import './style.css'

function Cadastro({ history }) {
  const prefix = 'common_register__';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const handleChange = ({ target }) => {
    const { name: eName, value } = target;

    if (eName === 'email') return setEmail(value);
    if (eName === 'password') return setPassword(value);
    setName(value);
  };

  const handleClick = () => {
    const data = {
      name,
      email,
      password,
    };

    api.post('/register', data)
      .then((responseApi) => {
        helper.setStorage(responseApi.data);
        history.push(`/${responseApi.data.role}/products`);
      }).catch((err) => setError(err.response.data));
  };

  return (
    <div className='container-register'>
      <form>
      <h1>Registre-se</h1>
        <div className='container-input-register'>
        <Input
          type="text"
          label="Nome"
          value={ name }
          name="name"
          testid={ `${prefix}input-name` }
          onChange={ handleChange }
        />
        <Input
          type="email"
          label="Email"
          value={ email }
          name="email"
          onChange={ handleChange }
          testid={ `${prefix}input-email` }
        />
        <Input
          type="password"
          label="Senha"
          value={ password }
          name="password"
          onChange={ handleChange }
          testid={ `${prefix}input-password` }
          />
          { error
              && <p data-testid={ `${prefix}element-invalid_register` }>{error.message}</p> }
        </div>
        <Button
          label="Cadastrar"
          name="register-submit-btn"
          id="register-submit-btn"
          testid="common_register__button-register"
          onClick={ handleClick }
          value={ schemaValidate({ name, email, password }, registerSchema) }
        />
      </form>
      <div className='drink-img-div'>
      </div>
    </div>
  );
}

export default Cadastro;

Cadastro.propTypes = {
  history: PropTypes.func,
}.isRequired;
