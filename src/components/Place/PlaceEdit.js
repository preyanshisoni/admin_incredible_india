import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  DateTimeInput,
  NumberInput,
  useGetList,
  FileInput,
  FileField,
  ImageField,
} from "react-admin";

export const PlaceEdit = (props) => {
  const { data: locations, isLoading } = useGetList("locations", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "name", order: "ASC" },
    filter: {},
  });

  const { data: categories, isDataLoading } = useGetList("categories", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "name", order: "ASC" },
    filter: {},
  });

  const filteredLocation = locations?.filter(
    (location) => location.parent_id !== null
  );

  const dayChoices = [
    { id: "Monday", name: "Monday" },
    { id: "Tuesday", name: "Tuesday" },
    { id: "Wednesday", name: "Wednesday" },
    { id: "Thursday", name: "Thursday" },
    { id: "Friday", name: "Friday" },
    { id: "Saturday", name: "Saturday" },
  ];

  if (isLoading || isDataLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" label="Place Name" />
        <TextInput source="description" label="Description" />


        {/* <ReferenceInput source="location_id" label="Location" reference="locations">
          <SelectInput optionText="name" />
        </ReferenceInput> */}
        <ReferenceInput source="location_id" label="Location" reference="locations">
  <SelectInput optionText="name" />
</ReferenceInput>

        {/* <SelectInput
          source="location_id"
          label="Location"
          choices={filteredLocation.map((location) => ({
            id: location.id,
            name: location.name,
          }))}
          optionText="name"
          optionValue="id"
          emptyText="No Location Id"
        /> */}

        <ReferenceInput
          source="category_id"
          label="Category"
          reference="categories"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>

        <ArrayInput source="tags" label="Tags">
          <SimpleFormIterator>
            <TextInput />
          </SimpleFormIterator>
        </ArrayInput>

        <FileInput source="pictures" label="Images" accept="image/*" multiple>
          <FileField source="src" title="title" />
        </FileInput>



        <TextInput source="video" label="Video URL" />

        <NumberInput source="latitude" label="Latitude" />
        <NumberInput source="longitude" label="Longitude" />

        <ArrayInput source="contact_info" label="Contact Info">
          <SimpleFormIterator>
            <TextInput source="phone" label="Phone" />
            <TextInput source="email" label="Email" />
            <TextInput source="address" label="Address" />
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput source="opening_hours" label="Opening Hours">
          <SimpleFormIterator>
            <SelectInput source="day" label="Day" choices={dayChoices} />
            <TextInput source="open" label="Opening Time" />
            <TextInput source="close" label="Closing Time" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};
