import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateBooking } from '../../services/apiBookings';

export function useCheckout() {
  const queryClient = useQueryClient();
  const { mutate: checkout, isLoading: isCheckout } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: 'checked-out',
      }),

    /// this data is actually function returned from updateBooking.
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} succesfully checked out`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: (err) => toast.error(err.message),
  });

  return { checkout, isCheckout };
}
