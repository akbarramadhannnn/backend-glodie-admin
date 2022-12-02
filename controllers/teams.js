const formidable = require("formidable");
const configEnv = require("../config/env");
const path = require("path");
const fs = require("fs");
const {
  insertTeams,
  selectTeamsByName,
  selectAllTeams,
  selectTeamsById,
  deleteTeamsById,
  updateTeamsData,
  selectTeamsByNameNotById,
} = require("../models/teams");
const {
  ReplaceToStartUpperCase,
  ReplaceToLowerCaseNoSpace,
} = require("../utils/replace");
const teamsSchema = require("../models/schema/teams");
const Response = require("../helpers/response");

exports.createTeams = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async function (err, fields, files) {
    let { name, title, twitterLink, linkedinLink, description } = fields;
    const { photo } = files;

    name = ReplaceToStartUpperCase(name);

    if (!name) {
      return res.json(
        Response(false, 400, "Name is Required", {
          name: "name",
        })
      );
    }

    if (!title) {
      return res.json(
        Response(false, 400, "Title is Required", {
          name: "title",
        })
      );
    }

    if (!photo) {
      return res.json(
        Response(false, 400, "Photo is Required", {
          name: "photo",
        })
      );
    }

    const resultName = await selectTeamsByName(name);
    if (resultName.length > 0) {
      return res.json(
        Response(false, 400, "Name Already", {
          name: "name",
        })
      );
    }

    const pathImage = "./assets/images/teams";
    const oldPath = photo.filepath;
    const pathFile = path.resolve(
      pathImage,
      `${ReplaceToLowerCaseNoSpace(name)}-${photo.originalFilename}`
    );
    const rawData = fs.readFileSync(oldPath);
    fs.writeFile(pathFile, rawData, async (err) => {
      if (err) {
        const error = JSON.stringify(err, undefined, 2);
        return res.json(Response(false, 500, `Error`, JSON.parse(error)));
      }
      const pathPhoto =
        pathImage.replace(/\./g, "") +
        `/${ReplaceToLowerCaseNoSpace(name)}-${photo.originalFilename}`;
      const result = await insertTeams(
        name,
        title,
        twitterLink,
        linkedinLink,
        description,
        pathPhoto
      );

      if (result.insertId) {
        return res.json(Response(true, 201, "Added Teams Successfully", {}));
      }
    });
  });
};

exports.getAllTeams = async (req, res) => {
  try {
    const result = await selectAllTeams();
    if (!result.length > 0) {
      return res.json(Response(true, 204, "Get All Teams Successfully", {}));
    }

    const data = [];
    result.forEach((d) => {
      let newObj = {};
      newObj[teamsSchema[Object.keys(d)[0]]] = d.teams_id;
      newObj[teamsSchema[Object.keys(d)[1]]] = d.name;
      newObj[teamsSchema[Object.keys(d)[2]]] =
        d.title === "0"
          ? "Artist"
          : d.title === "1"
          ? "Project Manager"
          : d.title === "2"
          ? "Community Manager"
          : "Developer";
      newObj[teamsSchema[Object.keys(d)[3]]] = d.twitter_link;
      newObj[teamsSchema[Object.keys(d)[4]]] = d.linkedin_link;
      newObj[teamsSchema[Object.keys(d)[5]]] = d.description;
      newObj[
        teamsSchema[Object.keys(d)[6]]
      ] = `${configEnv.base_url}${d.path_photo_profile}`;
      data.push(newObj);
    });
    return res.json(
      Response(true, 200, "Get All Teams Successfully", {
        data,
      })
    );
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.getTeamsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectTeamsById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Teams Not Found", {}));
    }

    let newObj = {};
    newObj[teamsSchema[Object.keys(result[0])[0]]] = result[0].teams_id;
    newObj[teamsSchema[Object.keys(result[0])[1]]] = result[0].name;
    newObj[teamsSchema[Object.keys(result[0])[2]]] = result[0].title;
    newObj[teamsSchema[Object.keys(result[0])[3]]] = result[0].twitter_link;
    newObj[teamsSchema[Object.keys(result[0])[4]]] = result[0].linkedin_link;
    newObj[teamsSchema[Object.keys(result[0])[5]]] = result[0].description;
    newObj[
      teamsSchema[Object.keys(result[0])[6]]
    ] = `${configEnv.base_url}${result[0].path_photo_profile}`;

    return res.json(Response(true, 200, "Get Teams Successfully", newObj));
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.updateTeams = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectTeamsById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Teams Not Found", {}));
    }

    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async function (err, fields, files) {
      let { name, title, twitterLink, linkedinLink, description } = fields;
      const { photo } = files;

      name = ReplaceToStartUpperCase(name);

      if (!name) {
        return res.json(
          Response(false, 400, "Name is Required", {
            name: "name",
          })
        );
      }

      if (!title) {
        return res.json(
          Response(false, 400, "Title is Required", {
            name: "title",
          })
        );
      }

      const resultSelectNameNotyId = await selectTeamsByNameNotById(name, id);
      if (resultSelectNameNotyId.length > 0) {
        return res.json(
          Response(false, 400, "Teams Name Already", {
            name: "name",
          })
        );
      }

      const pathImage = "./assets/images/teams";
      if (photo) {
        const newPhoto = `${pathImage.replace(
          /\./g,
          ""
        )}/${ReplaceToLowerCaseNoSpace(name)}-${photo.originalFilename}`;
        const oldPhoto = result[0].path_photo_profile;
        const isPhotoSame = newPhoto === oldPhoto;
        if (!isPhotoSame) {
          // Delete Old photo
          const oldPathFile = path.resolve(`.${oldPhoto}`);
          fs.unlinkSync(oldPathFile);
        }

        // Update New Photo
        const newPathFile = path.resolve(
          pathImage,
          `${ReplaceToLowerCaseNoSpace(name)}-${photo.originalFilename}`
        );
        const rawData = fs.readFileSync(photo.filepath);
        fs.writeFile(newPathFile, rawData, async (err) => {
          if (err) {
            const error = JSON.stringify(err, undefined, 2);
            return res.json(Response(false, 500, `Error`, JSON.parse(error)));
          }

          const pathPhoto =
            pathImage.replace(/\./g, "") +
            `/${ReplaceToLowerCaseNoSpace(name)}-${photo.originalFilename}`;

          const resultUpdate = await updateTeamsData(
            id,
            name,
            title,
            twitterLink,
            linkedinLink,
            description,
            pathPhoto
          );
          if (resultUpdate.insertId === 0) {
            return res.json(
              Response(true, 201, "Updated Teams Successfully", {})
            );
          }
        });
      } else {
        const resultUpdate = await updateTeamsData(
          id,
          name,
          title,
          twitterLink,
          linkedinLink,
          description
        );
        if (resultUpdate.insertId === 0) {
          return res.json(
            Response(true, 201, "Updated Teams Successfully", {})
          );
        }
      }
    });
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.deleteTeams = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectTeamsById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Teams Not Found", {}));
    }

    const pathFile = path.resolve(`.${result[0].path_photo_profile}`);
    fs.unlinkSync(pathFile);

    const resultDelete = await deleteTeamsById(id);
    if (resultDelete.insertId === 0) {
      return res.json(Response(true, 200, `Deleted Teams Successfully`, {}));
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};
