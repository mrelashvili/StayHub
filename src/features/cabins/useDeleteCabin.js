import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { deleteCabin as deleteCabinApi } from '../../services/apiCabins';

export function useDeleteCabin() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success('Cabin succesfully deleted!');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: (err) => toast.error(err.message), /// display error which will be threw from mutationFn...
  });

  return { isDeleting, deleteCabin };
}
//
