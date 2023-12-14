/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import useRecentBookings from './useRecentBookings';
import useRecentStays from './useRecentStays';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isLoading } = useRecentBookings();
  const { stays, confirmedStays, isLoading: isStaysLoading } = useRecentStays();

  if (isLoading || isStaysLoading) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <div>Statistics</div>
      <div>Today&apos;s activity</div>
      <div>Chart stay durations</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
