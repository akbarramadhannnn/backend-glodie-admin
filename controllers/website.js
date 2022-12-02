const {
  selectWebsiteByMenuName,
  insertMultipleWebsiteContent,
  updateMultipleWebsiteContent,
  getWebsiteContentByMenuNameAndKeyName,
} = require("../models/website");
const fs = require("fs");
const path = require("path");
const configEnv = require("../config/env");
const formidable = require("formidable");
const websiteContentSchema = require("../models/schema/websiteContent");
const Response = require("../helpers/response");

exports.getWebsiteByMenuName = async (req, res) => {
  const { menuName } = req.params;
  try {
    const result = await selectWebsiteByMenuName(menuName);
    if (!result.length) {
      return res.json(
        Response(false, 204, `Get Content Website ${menuName} Not Found`, {})
      );
    }

    const regex = /[^"']+\.(?:(?:pn|jpe?)g|gif)\b/;

    const data = [];
    result.forEach((d) => {
      let newObj = {};
      if (regex.test(d.value)) {
        d.value = `${configEnv.base_url}${d.value}`;
      }
      newObj[websiteContentSchema[Object.keys(d)[0]]] = d.website_content_id;
      newObj[websiteContentSchema[Object.keys(d)[1]]] = d.menu_name;
      newObj[websiteContentSchema[Object.keys(d)[2]]] = d.key_name;
      newObj[websiteContentSchema[Object.keys(d)[3]]] = d.value;
      data.push(newObj);
    });

    return res.json(
      Response(true, 200, `Get Content Website ${menuName} Successfuly`, data)
    );
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.createWebsiteByMenuName = async (req, res) => {
  const { menuName } = req.params;
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req);
  form.on("file", (name, file) => {
    console.log("[file]");
    form.emit("data", { name: "file", key: name, value: file });
  });
  form.on("field", (name, field) => {
    console.log("[field]");
    form.emit("data", { name: "field", key: name, value: field });
  });
  form.on("data", async ({ name, key, value }) => {
    console.log("[data]");
    const data = [];
    if (name === "file") {
      const dir = `./assets/images/website/${menuName}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const fileName = `${key.toLowerCase()}-${value.originalFilename}`;
      const filePath = value.filepath;
      const pathName = path.resolve(dir, fileName);
      const rawData = fs.readFileSync(filePath);
      fs.writeFileSync(pathName, rawData);
      data.push([menuName, key, dir.replace(/\./g, "") + `/${fileName}`]);
    } else if (name === "field") {
      data.push([menuName, key, value]);
    }
    await insertMultipleWebsiteContent(data);
  });
  form.on("end", () => {
    console.log("[end]");
    return res.json(
      Response(true, 201, `Added Website Content ${menuName} Successfully`, {})
    );
  });
};

exports.updateWebsiteByMenuName = async (req, res) => {
  const { menuName } = req.params;
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

    const dataArr = [];
    if (Object.keys(resultForm.fields).length > 0) {
      for (const key in resultForm.fields) {
        const result = await getWebsiteContentByMenuNameAndKeyName(
          menuName,
          key
        );
        let resultData = result[0];
        if (resultData.key_name === key) {
          if (resultForm.fields[key] === "") {
            resultData.value = result[0].value;
          } else {
            resultData.value = resultForm.fields[key];
          }
          dataArr.push(resultData);
        }
      }
    }

    if (Object.keys(resultForm.files).length > 0) {
      const dir = `./assets/images/website/${menuName}`;
      for (const key in resultForm.files) {
        const result = await getWebsiteContentByMenuNameAndKeyName(
          menuName,
          key
        );
        let resultData = result[0];

        const fileName = `${key.toLowerCase()}-${
          resultForm.files[key].originalFilename
        }`;
        const pathFileName = dir.replace(/\./g, "") + `/${fileName}`;
        if (resultData.key_name === key) {
          const isSamePath = pathFileName === resultData.value;
          if (!isSamePath) {
            const oldPathFile = path.resolve(`.${resultData.value}`);
            fs.unlinkSync(oldPathFile);

            const filePath = resultForm.files[key].filepath;
            const pathName = path.resolve(dir, fileName);
            const rawData = fs.readFileSync(filePath);
            fs.writeFileSync(pathName, rawData);

            resultData.value = pathFileName;
            dataArr.push(resultData);
          }
        }
      }
    }

    let count = 0;
    for (let i = 0; i < dataArr.length; i++) {
      count += 1;
      await updateMultipleWebsiteContent([
        dataArr[i].menu_name,
        dataArr[i].key_name,
        dataArr[i].value,
        dataArr[i].website_content_id,
      ]);
    }

    if (count === dataArr.length) {
      return res.json(
        Response(
          true,
          201,
          `Update Website Content ${menuName} Successfully`,
          {}
        )
      );
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }

  // try {
  //   await form
  //     .parse(req)
  //     .on("file", (name, value) => {
  //       form.emit("data", { name: "file", key: name, value });
  //     })
  //     .on("field", (name, value) => {
  //       form.emit("data", { name: "field", key: name, value });
  //     })
  //     .on("data", async ({ name, key, value }) => {
  //       const result = await getWebsiteContentByMenuNameAndKeyName(
  //         menuName,
  //         key
  //       );
  //       let resultData = result[0];
  //       const dataArr = [];

  //       if (name === "file") {
  //         const dir = `./assets/images/website/${menuName}`;
  //         const fileName = `${key.toLowerCase()}-${value.originalFilename}`;
  //         const pathFileName = dir.replace(/\./g, "") + `/${fileName}`;
  //         if (resultData.key_name === key) {
  //           const isSamePath = pathFileName === resultData.value;
  //           if (!isSamePath) {
  //             const oldPathFile = path.resolve(`.${resultData.value}`);
  //             fs.unlinkSync(oldPathFile);

  //             const filePath = value.filepath;
  //             const pathName = path.resolve(dir, fileName);
  //             const rawData = fs.readFileSync(filePath);
  //             fs.writeFileSync(pathName, rawData);

  //             resultData.value = pathFileName;
  //             dataArr.push([
  //               `${resultData.menu_name}`,
  //               `${resultData.key_name}`,
  //               `${resultData.value}`,
  //               `${resultData.website_content_id}`,
  //             ]);
  //           }
  //         }
  //       } else if (name === "field") {
  //         if (resultData.key_name === key) {
  //           if (value === "") {
  //             resultData.value = result[0].value;
  //           } else {
  //             resultData.value = value;
  //           }
  //         }

  //         dataArr.push([
  //           resultData.menu_name,
  //           resultData.key_name,
  //           resultData.value,
  //           resultData.website_content_id,
  //         ]);
  //       }

  //       if (dataArr[0]) {
  //         await updateMultipleWebsiteContent(dataArr[0]);
  //       }
  //     });
  //   return res.json(
  //     Response(true, 201, `Update Website Content ${menuName} Successfully`, {})
  //   );
  // } catch (err) {
  //   console.log("errr", err);
  //   const error = JSON.stringify(err, undefined, 2);
  //   return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  // }
};
