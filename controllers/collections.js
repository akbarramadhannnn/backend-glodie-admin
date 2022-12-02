const Response = require("../helpers/response");
const path = require("path");
const configEnv = require("../config/env");
const fs = require("fs");
const {
  ReplaceToSlug,
  ReplaceToStartUpperCase,
  ReplaceToLowerCaseNoSpace,
} = require("../utils/replace");
const formidable = require("formidable");
const collectionsSchema = require("../models/schema/collections");
const {
  insertCollections,
  selectCollectionsByName,
  selectAllCollections,
  selectCollectionsById,
  selectCollectionsByNameNotById,
  updateCollectionsData,
  deleteCollectionsDataById,
} = require("../models/collections");

exports.createCollections = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  try {
    const resultForm = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log("errr", err);
          const error = JSON.stringify(err, undefined, 2);
          return res.json(Response(false, 500, `Error`, JSON.parse(error)));
        }
        resolve({
          fields,
          files,
        });
      });
    });

    if (!resultForm.fields.name) {
      return res.json(
        Response(false, 400, "Name is Required", {
          name: "name",
        })
      );
    }

    if (!resultForm.fields.urlLink) {
      return res.json(
        Response(false, 400, "Url Link is Required", {
          name: "link",
        })
      );
    }

    if (!Object.keys(resultForm.files).length > 0) {
      return res.json(
        Response(false, 400, "Image is Required", {
          name: "image",
        })
      );
    }

    const name = ReplaceToStartUpperCase(resultForm.fields.name);
    const slug = ReplaceToSlug(resultForm.fields.name);
    const urlLink = resultForm.fields.urlLink;
    const image = resultForm.files.image;

    const resultSelectName = await selectCollectionsByName(name);
    if (resultSelectName.length > 0) {
      return res.json(
        Response(false, 400, "Collection Name Already", {
          name: "name",
        })
      );
    }

    const dir = "./assets/images/collections";
    const filePath = image.filepath;
    const dirFile = path.resolve(
      dir,
      `${ReplaceToLowerCaseNoSpace(name)}-${image.originalFilename}`
    );
    const rawData = fs.readFileSync(filePath);
    fs.writeFileSync(dirFile, rawData);

    const pathImage =
      dir.replace(/\./g, "") +
      `/${ReplaceToLowerCaseNoSpace(name)}-${image.originalFilename}`;

    const result = await insertCollections(name, slug, urlLink, pathImage);
    if (result.insertId) {
      return res.json(
        Response(true, 201, "Added Collections Successfully", {})
      );
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.getAllCollections = async (req, res) => {
  try {
    const result = await selectAllCollections();
    if (!result.length > 0) {
      return res.json(
        Response(true, 204, "Get All Collections Successfully", {})
      );
    }

    const data = [];
    result.forEach((d) => {
      let newObj = {};
      newObj[collectionsSchema[Object.keys(d)[0]]] = d.collections_id;
      newObj[collectionsSchema[Object.keys(d)[1]]] = d.name;
      newObj[collectionsSchema[Object.keys(d)[2]]] = d.slug;
      newObj[collectionsSchema[Object.keys(d)[3]]] = d.url_link;
      newObj[
        collectionsSchema[Object.keys(d)[4]]
      ] = `${configEnv.base_url}${d.path_image}`;
      data.push(newObj);
    });

    return res.json(
      Response(true, 200, "Get All Collections Successfully", {
        data,
      })
    );
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.getCollectionsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectCollectionsById(id);
    if (!result.length) {
      return res.json(
        Response(false, 400, "Get Collections Not Found", {
          name: "collectionsId",
        })
      );
    }

    let newObj = {};
    newObj[collectionsSchema[Object.keys(result[0])[0]]] =
      result[0].collections_id;
    newObj[collectionsSchema[Object.keys(result[0])[1]]] = result[0].name;
    newObj[collectionsSchema[Object.keys(result[0])[2]]] = result[0].slug;
    newObj[collectionsSchema[Object.keys(result[0])[3]]] = result[0].url_link;
    newObj[
      collectionsSchema[Object.keys(result[0])[4]]
    ] = `${configEnv.base_url}${result[0].path_image}`;

    return res.json(
      Response(true, 200, "Get Collections Successfully", newObj)
    );
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.updateCollections = async (req, res) => {
  const { id } = req.params;
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  try {
    const resultSelectid = await selectCollectionsById(id);
    if (!resultSelectid.length) {
      return res.json(
        Response(false, 400, "Id Not Found", {
          name: "collectionsId",
        })
      );
    }

    const resultForm = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log("errr", err);
          const error = JSON.stringify(err, undefined, 2);
          return res.json(Response(false, 500, `Error`, JSON.parse(error)));
        }
        resolve({
          fields,
          files,
        });
      });
    });

    if (!resultForm.fields.name) {
      return res.json(
        Response(false, 400, "Name is Required", {
          name: "name",
        })
      );
    }

    if (!resultForm.fields.urlLink) {
      return res.json(
        Response(false, 400, "Url Link is Required", {
          name: "link",
        })
      );
    }

    const name = ReplaceToStartUpperCase(resultForm.fields.name);
    const slug = ReplaceToSlug(resultForm.fields.name);
    const urlLink = resultForm.fields.urlLink;
    const image = resultForm.files.image;
    let pathImage = "";

    const resultSelectNameNotyId = await selectCollectionsByNameNotById(
      name,
      id
    );
    if (resultSelectNameNotyId.length > 0) {
      return res.json(
        Response(false, 400, "Collection Name Already", {
          name: "name",
        })
      );
    }

    const dir = "./assets/images/collections";

    if (image) {
      const newImage = `${dir.replace(/\./g, "")}/${ReplaceToLowerCaseNoSpace(
        name
      )}-${image.originalFilename}`;
      const oldImage = resultSelectid[0].path_image;
      const isPhotoSame = newImage === oldImage;
      if (!isPhotoSame) {
        // Delete Old photo
        const oldPathFile = path.resolve(`.${oldImage}`);
        fs.unlinkSync(oldPathFile);
      }

      const filePath = image.filepath;
      const dirFile = path.resolve(
        dir,
        `${ReplaceToLowerCaseNoSpace(name)}-${image.originalFilename}`
      );
      const rawData = fs.readFileSync(filePath);
      fs.writeFileSync(dirFile, rawData);
      pathImage = newImage;
    } else {
      pathImage = resultSelectid[0].path_image;
    }

    const resultUpdate = await updateCollectionsData(
      id,
      name,
      slug,
      urlLink,
      pathImage
    );
    if (resultUpdate.insertId === 0) {
      return res.json(
        Response(true, 201, "Updated Collections Successfully", {})
      );
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.deleteCollections = async (req, res) => {
  const { id } = req.params;

  try {
    const resultSelectid = await selectCollectionsById(id);
    if (!resultSelectid.length) {
      return res.json(
        Response(false, 400, "Id Not Found", {
          name: "collections_id",
        })
      );
    }

    const pathFile = path.resolve(`.${resultSelectid[0].path_image}`);
    fs.unlinkSync(pathFile);

    const result = await deleteCollectionsDataById(id);
    if (result.insertId === 0) {
      return res.json(
        Response(true, 200, `Deleted Collections Successfully`, {})
      );
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};
