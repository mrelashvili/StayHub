import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { signup as singupApi } from '../../services/apiAuth';

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: singupApi,
    onSuccess: () => {
      toast.success(
        'Account successfully created! Please verity the new account from the user email address'
      );
    },
  });

  return { signup, isLoading };
}
