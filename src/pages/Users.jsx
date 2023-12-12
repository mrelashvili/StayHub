import SignupForm from '../features/authentication/SignupForm';
import Heading from '../ui/Heading';

export function NewUsers() {
  return (
    <>
      <Heading as="h2">Create a new user</Heading>
      <SignupForm />
    </>
  );
}
