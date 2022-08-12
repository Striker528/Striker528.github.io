import React from 'react'
import { useState } from 'react';
import { createActor } from '../../api/actor';
import { useNotification } from '../../hooks';
import ActorForm from '../form/ActorForm'
import ModalContainer from './ModalContainer'

export default function ActorUpload({ visible, onClose }) {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  
  const handleSubmit = async data => {
    setBusy(true)
    //console.log(data);
    const { error, actor } = await createActor(data);
    setBusy(false)
    //console.log(res);

    //if everything is fine, need to hid the model
    if (error) {
      return updateNotification('error', error);
    }
    updateNotification('success', "Uploaded the actor successfully");
    onClose()
  };
  //not busy handle submit
  //otherwise use null
  return (
      <ModalContainer
          visible={visible}
          onClose={onClose}
          ignoreContainer
      >
      <ActorForm
        onSubmit={!busy ? handleSubmit: null}
        title="Create New Actor"
        btnTitle="Create"
        busy={busy}
      />
    </ModalContainer>
  )
}
