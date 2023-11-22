import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateSetting as upadteSettingApi } from '../../services/apiSettings';

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: upadteSettingApi,
    onSuccess: () => {
      toast.success('Setting succesfully updated!');
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateSetting };
}
