import React from 'react'
import { useState } from 'react';
import { createActor, updateActor } from '../../api/actor';
import { useNotification } from '../../hooks';
import ActorForm from '../form/ActorForm'
import ModalContainer from './ModalContainer'

export default function UpdateActor({visible, onClose, initialState, onSuccess}) {
    const [busy, setBusy] = useState(false);

    const { updateNotification } = useNotification();
    
    const handleSubmit = async data => {
        setBusy(true);
        const { error, actor } = await updateActor(initialState.id, data);
        setBusy(false);
        if (error) {
            return updateNotification('error', error);
        }

        //this is so the user does not have to reload the page to display the actor's new profile
        onSuccess(actor);
        updateNotification('success', "Updated the actor successfully");
        onClose();
    };
    

    return (
        <ModalContainer
            visible={visible}
            onClose={onClose}
            ignoreContainer
        >
        <ActorForm
          onSubmit={!busy ? handleSubmit: null}
          title="Update Actor"
          btnTitle="Update"
        busy={busy}
        initialState = {initialState}
        />
      </ModalContainer>
    )
}
