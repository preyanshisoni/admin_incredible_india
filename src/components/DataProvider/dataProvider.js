import { Create, DELETE, fetchUtils, Title } from "react-admin";
import { stringify } from "query-string";
import uploadToCloudinary from "../../UploadCloudinary";



const apiUrl = "http://localhost:3000";

const httpClient = fetchUtils.fetchJson;

const dataProvider = {

  create: async (resource, params) => {

    console.log("inside create")
    if (["locations", "categories", "places", "transport", "locationtransport"].includes(resource)) {
      const formData = new FormData();

      if (resource == "locations" && !params.data.parent_id) {
        params.data.parent_id = null;
      }

      if (resource === "locations") {
        const imageUrl = await uploadToCloudinary(params.data.picture.rawFile);
        console.log("✅ Uploaded image URL:", imageUrl);
        params.data.picture = imageUrl
        // if (params.data.picture && params.data.picture.rawFile) {
        //   formData.append("picture", params.data.picture.rawFile);
        // }
      }
      if (params.data.pictures && Array.isArray(params.data.pictures)) {
        const uploadedImages = await Promise.all(
          params.data.pictures.map(async (fileObj) => {
            if (fileObj.rawFile) {
              const imageUrl = await uploadToCloudinary(fileObj.rawFile);
              return imageUrl; // Just the URL string
            }
            return fileObj; // Already uploaded URL string
          })
        );

        params.data.pictures = uploadedImages; // Now it's a string[]
      }

      // console.log("params.data:", params.formData);
      console.log("params.data.pictures:", params.data);

      // Object.keys(params.data).forEach((key) => {

      //   if (params.data.pictures && Array.isArray(params.data.pictures)) {
      //     const uploadedImages = Promise.all(
      //       params.data.pictures.map(async (fileObj) => {
      //         if (fileObj.rawFile) {
      //           return await uploadToCloudinary(fileObj.rawFile);
      //         }
      //         return fileObj;
      //       })
      //     );

      //     params.data.pictures = uploadedImages;
      //   }
      //   else if (key === "location_id" || key === "category_id") {
      //     formData.append(key, params.data[key]);
      //   } else if (key === "contact_info" || key === "opening_hours") {
      //     formData.append(key, JSON.stringify(params.data[key]));
      //   } else {
      //     formData.append(key, params.data[key]);
      //     console.log(`Appending ${key}:`, params.data[key]);

      //   }
      // });

      // Object.keys(params.data).forEach((key) => {
      //   if (key === "location_id" || key === "category_id") {
      //     formData.append(key, params.data[key]);
      //   } else if (key === "contact_info" || key === "opening_hours" || key === "pictures") {
      //     formData.append(key, JSON.stringify(params.data[key])); // ✅ Convert pictures array to JSON
      //   } else {
      //     formData.append(key, params.data[key]);
      //     console.log(`Appending ${key}:`, params.data[key]);
      //   }
      // });

      Object.keys(params.data).forEach((key) => {
        const value = params.data[key];

        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
        console.log(`Appending ${key}:`, value);
      });


      return fetch(`${apiUrl}/${resource}`, {
        method: "POST",
        body: formData,

      })
        .then((response) => response.json(),


        )
        .then((data) => ({ data: { ...data, id: data._id } }));
    }

    if (resource === "places/nearby_places") {
      return fetch(`${apiUrl}/places/addnearby`, {
        method: "POST",
        body: JSON.stringify(params.data),
        headers: new Headers({ "Content-Type": "application/json" }),
      })
        .then((response) => response.json())
        .then((data) => ({ data: { ...data, id: data._id } }));
    }

    return Promise.reject("Unknown resource!");
  },


  getList: (resource, params) => {
    if (resource === "places/nearby_places") {
      const url = `${apiUrl}/places/getall`;

      return httpClient(url).then(({ json }) => ({
        data: json.map((place) => ({ ...place, id: place._id })),
        total: json.length,
      }));
    }

    if (
      resource === "locations" ||
      resource === "categories" ||
      resource === "places" ||
      resource === "transport" ||
      resource === "locationtransport"
    ) {
      const { page, perPage, filter } = params;
      const query = {
        _page: page,
        _limit: perPage,
        ...filter,
      };

      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ json }) => {
        const dataWithIds = json.map((item) => ({
          ...item,
          id: item._id,
        }));

        return {
          data: dataWithIds,
          total: dataWithIds.length,
        };
      });
    }

    return Promise.reject("Unknown resource!");
  },

  update: async (resource, params) => {
    if (resource === "places/nearby_places") {
      const url = `${apiUrl}/places/updatenearby/${params.id}`;

      if (resource == "locations" && !params.data.parent_id) {
        params.data.parent_id = null;
      }

      return fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.data),
      })
        .then((response) => response.json())
        .then((data) => ({
          data: { ...data, id: data._id },
        }));
    }

    if (
      ["locations", "categories", "places", "transport", "locationtransport"].includes(resource)
    ) {
      const url = `${apiUrl}/${resource}/${params.id}`;
      const formData = new FormData();

      if (params.data.picture?.rawFile) {
        const imageUrl = await uploadToCloudinary(params.data.picture.rawFile);
        params.data.picture = imageUrl;
      }

      if (params.data.new_images && Array.isArray(params.data.new_images)) {
        const uploadedImages = await Promise.all(
          params.data.new_images.map(async (fileObj) => {
            if (fileObj.rawFile) {
              const imageUrl = await uploadToCloudinary(fileObj.rawFile);
              return imageUrl;
            }
            return typeof fileObj === "string" ? fileObj : null;
          })
        );


        params.data.pictures = uploadedImages.filter(
          (url) => typeof url === "string" && url.startsWith("http")
        );

        delete params.data.new_images;
        delete params.data.image_id;
      }
      // if (params.data.pictures && Array.isArray(params.data.pictures)) {
      //   params.data.pictures = params.data.pictures.filter(
      //     (item) => typeof item === "string" && item.startsWith("http")
      //   );
      // }

      Object.keys(params.data).forEach((key) => {
        if (params.data.pictures && Array.isArray(params.data.pictures)) {
          params.data.pictures = params.data.pictures.filter(
            (item) => typeof item === "string" && item.startsWith("http")
          );
          formData.append("pictures", JSON.stringify(params.data.pictures));
        }
        if (key === "parent_id") {
          if (params.data[key] && typeof params.data[key] === "object") {
            formData.append("parent_id", params.data[key].id || params.data[key]._id);
          } else if (!params.data[key]) {
            formData.append("parent_id", "");
          } else {
            formData.append("parent_id", params.data[key]);
          }
        }

         else if (key === "pictures" && Array.isArray(params.data[key])) {
          formData.append("pictures", JSON.stringify(params.data[key]));
        } else {
          formData.append(key, params.data[key]);
        }

      });

      return fetch(url, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to update ${resource}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => ({
          data: { ...data, id: data._id },
        }))
        .catch((error) => {
          console.error("Update Error:", error);
          throw error;
        });
    }

    return Promise.reject("Unknown resource!");
  },

  getOne: (resource, params) => {
    if (
      resource === "locations" ||
      resource === "categories" ||
      resource === "places" ||
      resource === "transport" ||
      resource === "locationtransport"
    ) {
      const url = `${apiUrl}/${resource}/${params.id}`;

      return httpClient(url).then(({ json }) => ({
        data: {
          ...json,
          id: json._id || json.id,
        },
      }));
    }
    if (resource === "places/nearby_places") {
      const url = `${apiUrl}/places/nearby_places/${params.id}`;

      return httpClient(url).then(({ json }) => ({
        data: {
          ...json,
          id: json._id || json.id,
        },
      }));
    }

    return Promise.reject("Unknown resource!");
  },

  getMany: (resource, params) => {
    console.log("Params in getOne:", params);
    if (["locations", "categories", "places", "transport"].includes(resource)) {
      const query = {
        id: params.ids,
      };

      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      return httpClient(url).then(({ json }) => {
        const dataWithIds = json.map((item) => ({
          ...item,
          id: item._id,
        }));

        return { data: dataWithIds };
      });
    }
    return Promise.reject("Unknown resource!");
  },

  delete: (resource, params) => {
    if (resource === "places/nearby_places") {
      const url = `${apiUrl}/places/deletnearby/${params.id}`;
      return httpClient(url, {
        method: "DELETE",
      }).then(({ json }) => ({
        data: json,
      }));
    }
    if (
      resource === "locations" ||
      resource === "categories" ||
      resource === "places" ||
      resource === "transport" ||
      resource === "locationtransport"
    ) {
      const url = `${apiUrl}/${resource}/${params.id}`;
      return httpClient(url, {
        method: "DELETE",
      }).then(({ json }) => ({
        data: json,
      }));
    }

    return Promise.reject("Unknown resource!");
  },

  getManyReference: (resource, params) => {
    if (["locations", "categories", "places", "transport"].includes(resource)) {
      const { target, id, pagination } = params;
      const query = {
        [target]: id,
        _page: pagination.page,
        _limit: pagination.perPage,
      };

      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      return httpClient(url).then(({ json }) => ({
        data: json.map((item) => ({ ...item, id: item._id })),
        total: json.length,
      }));
    }
    return Promise.reject("Unknown resource!");
  },

  deleteMany: (resource, params) => {
    if (["locations", "categories", "places", "transport"].includes(resource)) {
      const url = `${apiUrl}/${resource}`;

      return httpClient(url, {
        method: "DELETE",

        body: JSON.stringify({ ids: params.ids }),
      }).then(({ json }) => ({
        data: json.ids || params.ids,
      }));
    }

    return Promise.reject("Unknown resource!");
  },
};
export default dataProvider;



