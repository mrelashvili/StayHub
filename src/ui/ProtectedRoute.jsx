/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { useUser } from '../features/authentication/userUser';
import Spinner from './Spinner';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-items: center;
`;

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  /// Load the authenticated user
  const { isLoading, isAuthenticated } = useUser();

  /// If no AUTH user, redirect to /login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate('/login');
  }, [isAuthenticated, isLoading, navigate]);

  /// While loading, show spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />;
      </FullPage>
    );

  /// If there's user, render app
  if (isAuthenticated) return children;
};

export default ProtectedRoute;
