import { useState } from 'react';
import Button from './../../ui/Button';
import Modal from './../../ui/Modal';
import CreateCabinForm from './CreateCabinForm';

const AddCabin = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpenModal((s) => !s)}>Add new cabin</Button>

      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <CreateCabinForm onClose={() => setIsOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default AddCabin;
