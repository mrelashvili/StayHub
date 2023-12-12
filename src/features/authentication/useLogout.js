import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../../services/apiAuth';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // remove user (in this case everything) from react query cache
      queryClient.removeQueries();

      navigate('/login', { replace: true });
    },
  });

  return { logout, isLoading };
};

export default useLogout;
