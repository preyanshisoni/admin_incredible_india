import React from "react";
import { Admin, Resource } from "react-admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import dataProvider from "./components/DataProvider/dataProvider";

import { LocationCreate } from "./components/Location/LocationCreate";
import { LocationList } from "./components/Location/LocationList";
import { LocationEdit } from "./components/Location/LocationEdit";

import { CategoryCreate } from "./components/Category/CategoryCreate";
import { CategoryList } from "./components/Category/CategoryList";
import { CategoryEdit } from "./components/Category/CategoryEdit";

import { PlaceCreate } from "./components/Place/PlaceCreate";
import { PlaceList } from "./components/Place/PlaceList";
import { PlaceEdit } from "./components/Place/PlaceEdit";
import { TransportCreate } from "./components/Transport/TransportCreate";
import { TransportList } from "./components/Transport/TransportList";
import { TransportEdit } from "./components/Transport/TransportEdit";
import NearbyPlacesList from "./components/Place/NearByPlaceList";
import CreateNearbyPlace from "./components/Place/CreateNearByPlace";
import EditNearbyPlace from "./components/Place/EditNearByPlace";
import { LocationTransportCreate } from "./components/Location/LocationTransportCreate";
import { LocationTransportList } from "./components/Location/LocationTransportList";
import { LocationTransportEdit } from "./components/Location/LocationTransportEdit";

const App = () => (
  <Admin dataProvider={dataProvider}>
    <div style={{ backgroundColor: "black" }}>
      <Resource
        name="locations"
        create={LocationCreate}
        edit={LocationEdit}
        list={LocationList}
      />
      <Resource
        name="places"
        create={PlaceCreate}
        edit={PlaceEdit}
        list={PlaceList}
      />
      <Resource
        name="categories"
        create={CategoryCreate}
        list={CategoryList}
        edit={CategoryEdit}
      />
      <Resource
        name="transport"
        create={TransportCreate}
        edit={TransportEdit}
        list={TransportList}
      />
      <Resource
        name="locationtransport"
        create={LocationTransportCreate}
        edit={LocationTransportEdit}
        list={LocationTransportList}
      />
      <Resource
        name="places/nearby_places"
        list={NearbyPlacesList}
        create={CreateNearbyPlace}
        edit={EditNearbyPlace}
      />
    </div>
  </Admin>
);
export default App;
