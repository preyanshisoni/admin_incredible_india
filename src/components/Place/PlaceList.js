import React from 'react';
import { Datagrid, DeleteButton, EditButton, List, TextField, ArrayField, SingleFieldList, ChipField, ReferenceField, ImageField } from 'react-admin';

export const PlaceList = () => (
    <List>
        <Datagrid>
            <TextField source="name" label="Name" />
            <TextField source="description" label="Description" />

<ArrayField source="pictures" label="Images">
  <SingleFieldList>
    <ImageField source="src" title="title" />
  </SingleFieldList>
</ArrayField>


        <TextField source="latitude"  label="Latitude"/>
        <TextField source="longitude"  label="longitude"/>

            <TextField source="contact_info.phone" label="Phone" />
            <TextField source="contact_info.email" label="Email" />
            <TextField source="contact_info.address" label="Address" />


            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

