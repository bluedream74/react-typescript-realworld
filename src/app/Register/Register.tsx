import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { SessionService, UserService } from '@libs/application';
import { UserCreateInput } from '@libs/application/user';
import { UserRegisterCommand } from '@libs/application/user/commands';
import { inject } from 'njct';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { RegisterView } from './RegisterView';

function useData() {
  const userService = inject<UserService>('userservice');
  const sessionService = inject<SessionService>('sessionservice');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInput>({
    resolver: classValidatorResolver(UserCreateInput),
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });
  const onSubmit = handleSubmit(async data => {
    const command = new UserRegisterCommand(userService);
    const result = await command.execute(data);
    result.match({
      Ok: () => {
        document.location = '/';
      },
      Err: error => {
        setServerErrorMessage(error.message);
      },
    });
  });
  const isLoggedIn = sessionService.isLoggedIn();

  return {
    isLoggedIn,
    onSubmit,
    errors,
    register,
    serverErrorMessage,
  };
}

export function Register(): JSX.Element {
  const { onSubmit, errors, register, serverErrorMessage, isLoggedIn } = useData();

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <RegisterView
      onSubmit={onSubmit}
      errors={errors}
      register={register}
      serverErrorMessage={serverErrorMessage}
    />
  );
}
