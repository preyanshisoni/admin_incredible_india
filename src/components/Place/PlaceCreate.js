  import React, { useState } from 'react';
  import { Editor, EditorState } from "draft-js";
  import "draft-js/dist/Draft.css";
  import {
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    NumberInput,
    FileInput,
    FileField,
    BooleanInput,
    useGetList,
    ImageField
  } from 'react-admin';

  export const PlaceCreate = () => {
    const { data: locations, isLoading } = useGetList("locations", {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "name", order: "ASC" },
      filter: {},
    });

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state) => {
      setEditorState(state);
    };

    const dayChoices = [
      { id: 'Monday', name: 'Monday' },
      { id: 'Tuesday', name: 'Tuesday' },
      { id: 'Wednesday', name: 'Wednesday' },
      { id: 'Thursday', name: 'Thursday' },
      { id: 'Friday', name: 'Friday' },
      { id: 'Saturday', name: 'Saturday' },
    ];

    const { data: categories, isDataLoading } = useGetList("categories", {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "name", order: "ASC" },
      filter: {},
    });

    const filteredLocation = locations?.filter(location => location.parent_id !== null);

    if (isLoading || isDataLoading) {
      return <span>Loading...</span>;
    }

    return (
      <Create>
        <SimpleForm>
          <TextInput source="name" label="Place Name" />
          <TextInput source="description" label="Description" />

          <SelectInput
            source="location_id"
            label="Location"
            choices={filteredLocation.map((location) => ({
              id: location.id,
              name: location.name
            }))}
            optionText="name"
            optionValue="id"
            emptyText="No Location Id"
          />

          <SelectInput
            source="category_id"
            label="Category"
            choices={categories?.map((category) => ({
              id: category.id,
              name: category.name
            }))}
            optionText="name"
            optionValue="id"
            emptyText="No Categories Available"
          />

          <ArrayInput source="tags" label="Tags">
            <SimpleFormIterator>
              <TextInput/>
            </SimpleFormIterator>
          </ArrayInput>


          {/* <FileInput source="pictures" label="Images" accept="image/*" multiple>
  <FileField source="src" title="title" />
</FileInput > */}
<FileInput source="pictures" label="Images" accept="image/*" multiple>
  <ImageField source="src" title="title" />
</FileInput>

          <TextInput source="video" label="Video URL" />
          <NumberInput source="latitude" label="Latitude" />
          <NumberInput source="longitude" label="Longitude" />

          <TextInput source="contact_info.phone" label="Phone" />
          <TextInput source="contact_info.email" label="Email" />
          <TextInput source="contact_info.address" label="Address" />

          <ArrayInput source="opening_hours" label="Opening Hours">
            <SimpleFormIterator>
              <SelectInput source="day" label="Day" choices={dayChoices} />
              <TextInput source="open" label="Opening Time" />
              <TextInput source="close" label="Closing Time" />
            </SimpleFormIterator>
          </ArrayInput>

        </SimpleForm>
      </Create>
    );
  };
