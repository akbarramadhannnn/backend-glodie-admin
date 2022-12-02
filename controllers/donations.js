const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const configEnv = require("../config/env");
const path = require("path");
const fs = require("fs");
const {
  insertDonations,
  selectAllDonations,
  selectDonationsById,
  deleteDonationsById,
  updateDonationsData,
} = require("../models/donations");
const donationsSchema = require("../models/schema/donations");
const Response = require("../helpers/response");

exports.createDonations = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async function (err, fields, files) {
    let { title } = fields;
    const { sertificateImage, glodieImage } = files;

    if (!title) {
      return res.json(
        Response(false, 400, "Title is Required", {
          name: "title",
        })
      );
    }

    if (!sertificateImage) {
      return res.json(
        Response(false, 400, "Sertificate Image is Required", {
          name: "sertificateImage",
        })
      );
    }

    if (!glodieImage) {
      return res.json(
        Response(false, 400, "Glodie Image is Required", {
          name: "glodieImage",
        })
      );
    }

    // sertificate image
    const fileNameSertificate = `${uuidv4()}.png`;
    const dirSertificate = "./assets/images/donations/sertificate";
    const oldPathSertificate = sertificateImage.filepath;
    const pathFileSertificate = path.resolve(dirSertificate, fileNameSertificate);
    const rawDataSertificate = fs.readFileSync(oldPathSertificate);
    fs.writeFileSync(pathFileSertificate, rawDataSertificate);
    const pathSertificate = dirSertificate.replace(/\./g, "") + `/${fileNameSertificate}`;

    // glodie image
    const fileNameGlodie = `${uuidv4()}.png`;
    const dirGlodie = "./assets/images/donations/glodie";
    const oldPathGlodie = glodieImage.filepath;
    const pathFileGlodie = path.resolve(dirGlodie, fileNameGlodie);
    const rawDataGlodie = fs.readFileSync(oldPathGlodie);
    fs.writeFileSync(pathFileGlodie, rawDataGlodie);
    const pathGlodie = dirGlodie.replace(/\./g, "") + `/${fileNameGlodie}`;

    const result = await insertDonations(title, pathSertificate, pathGlodie);

    if (result.insertId) {
      return res.json(Response(true, 201, "Added Donations Successfully", {}));
    }
  });
};

exports.getAllDonations = async (req, res) => {
  try {
    const result = await selectAllDonations();
    if (!result.length > 0) {
      return res.json(
        Response(true, 204, "Get All Donations Successfully", {})
      );
    }

    const data = [];
    result.forEach((d) => {
      let newObj = {};
      newObj[donationsSchema[Object.keys(d)[0]]] = d.donations_id;
      newObj[donationsSchema[Object.keys(d)[1]]] = d.title;
      newObj[
        donationsSchema[Object.keys(d)[2]]
      ] = `${configEnv.base_url}${d.sertificate_image_path}`;
      newObj[
        donationsSchema[Object.keys(d)[3]]
      ] = `${configEnv.base_url}${d.glodie_image_path}`;
      data.push(newObj);
    });
    return res.json(
      Response(true, 200, "Get All Donations Successfully", {
        data,
      })
    );
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.getDonationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectDonationsById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Donations Not Found", {}));
    }

    let newObj = {};
    newObj[donationsSchema[Object.keys(result[0])[0]]] = result[0].donations_id;
    newObj[donationsSchema[Object.keys(result[0])[1]]] = result[0].title;
    newObj[
      donationsSchema[Object.keys(result[0])[2]]
    ] = `${configEnv.base_url}${result[0].sertificate_image_path}`;
    newObj[
      donationsSchema[Object.keys(result[0])[3]]
    ] = `${configEnv.base_url}${result[0].glodie_image_path}`;

    return res.json(Response(true, 200, "Get Donations Successfully", newObj));
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.updateDonations = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectDonationsById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Donations Not Found", {}));
    }

    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async function (err, fields, files) {
      let { title } = fields;
      const { sertificateImage, glodieImage } = files;

      if (!title) {
        return res.json(
          Response(false, 400, "Title is Required", {
            name: "title",
          })
        );
      }

      const payload = {
        title,
        sertificateImage: "",
        glodieImage: "",
      };

      // sertificate image
      if (!sertificateImage) {
        payload.sertificateImage = result[0].sertificate_image_path;
      } else {
        const oldPhotoSertificate = result[0].sertificate_image_path;
        const oldPathFileSertificate = path.resolve(`.${oldPhotoSertificate}`);
        fs.unlinkSync(oldPathFileSertificate);

        const fileNameSertificate = `${uuidv4()}.png`;
        const dirSertificate = "./assets/images/donations/sertificate";
        const oldPathSertificate = sertificateImage.filepath;
        const pathFileSertificate = path.resolve(dirSertificate, fileNameSertificate);
        const rawDataSertificate = fs.readFileSync(oldPathSertificate);
        fs.writeFileSync(pathFileSertificate, rawDataSertificate);
        payload.sertificateImage = dirSertificate.replace(/\./g, "") + `/${fileNameSertificate}`;
      }

      // glodie image
      if (!glodieImage) {
        payload.glodieImage = result[0].glodie_image_path;
      } else {
        const oldPhotoGlodie = result[0].glodie_image_path;
        const oldPathFileGlodie = path.resolve(`.${oldPhotoGlodie}`);
        fs.unlinkSync(oldPathFileGlodie);

        const fileNameGlodie = `${uuidv4()}.png`;
        const dirGlodie = "./assets/images/donations/glodie";
        const oldPathGlodie = glodieImage.filepath;
        const pathFileGlodie = path.resolve(dirGlodie, fileNameGlodie);
        const rawDataGlodie = fs.readFileSync(oldPathGlodie);
        fs.writeFileSync(pathFileGlodie, rawDataGlodie);
        payload.glodieImage = dirGlodie.replace(/\./g, "") + `/${fileNameGlodie}`;
      }

      const resultUpdate = await updateDonationsData(
        id,
        payload.title,
        payload.sertificateImage,
        payload.glodieImage
      );

      if (resultUpdate.insertId === 0) {
        return res.json(
          Response(true, 201, "Updated Donations Successfully", {})
        );
      }
    });
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.deleteDonations = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectDonationsById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Donations Not Found", {}));
    }

    const pathFile1 = path.resolve(`.${result[0].sertificate_image_path}`);
    const pathFile2 = path.resolve(`.${result[0].glodie_image_path}`);

    fs.unlinkSync(pathFile1);
    fs.unlinkSync(pathFile2);

    const resultDelete = await deleteDonationsById(id);
    if (resultDelete.insertId === 0) {
      return res.json(
        Response(true, 200, `Deleted Donations Successfully`, {})
      );
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};
