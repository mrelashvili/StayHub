import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { updateBooking } from '../../services/apiBookings';

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkin, isLoading: isCheckinIn } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: 'checked-in',
        isPaid: true,
      }),

    /// this data is actually function returned from updateBooking.
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} succesfully checked in`);
      queryClient.invalidateQueries({ active: true });
      navigate('/');
    },

    onError: (err) => toast.error(err.message),
  });

  return { checkin, isCheckinIn };
}
