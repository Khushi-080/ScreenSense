// // const express = require("express");
// // const router = express.Router();

// // const Usage = require("../models/usage");

// // // Add usage
// // router.post("/add", async (req, res) => {
// //     console.log("REQ 👉", req.body);

// //     const { appName, timeUsed,limit } = req.body;

// //     const newUsage = new Usage({
// //       appName,
// //       timeUsed,
// //       limit,
// //     });

// //     await newUsage.save();

// //     console.log("Saved ✅");

// //     res.status(200).json({ message: "Saved successfully" });
// //   } catch (err) {
// //     console.log("ERROR ❌", err);

// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Get history
// // router.get("/", async (req, res) => {
// //   try {
// //     const data = await Usage.find().sort({ date: -1 });

// //     res.json(data);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // module.exports = router;


// // const express = require("express");
// // const router = express.Router();
// // const Usage = require("../models/usage");
// // router.post("/save", async (req, res) => {
// const express = require("express");
// //const router = express.Router();
// const Usage = require("../models/usage");
// //   const { appName, sessionTime, limit, breakTime } = req.body;

// //   let app = await Usage.findOne({ appName });

// //   if (app) {
// //     app.usedTime += sessionTime;   // 🔥 MERGE
// //     app.limit = limit;
// //     app.breakTime = breakTime;
// //     app.lastUsed = new Date();
// //   } else {
// //     app = new Usage({
// //       appName,
// //       usedTime: sessionTime,
// //       limit,
// //       breakTime
// //     });
// //   }

// //   await app.save();
// //   res.json(app);
// // });


// // //extend
// // router.post("/extend", async (req, res) => {
// //   const { appName, extraTime } = req.body;

// //   const app = await Usage.findOne({ appName });
// //   if (!app) return res.status(404).json({ msg: "App not found" });

// //   app.limit += extraTime;
// //   app.extensions += 1;

// //   await app.save();
// //   res.json(app);
// // });


// // //get usage history
// // router.get("/", async (req, res) => {
// //   const data = await Usage.find();
// //   res.json(data);
// // });



// const express = require("express");
// const router = express.Router();
// const Usage = require("../models/usage");

// router.post("/save", async (req, res) => {
//   const { appName, sessionTime, limit, breakTime } = req.body;

//   let app = await Usage.findOne({ appName });

//   if (app) {
//     app.usedTime += sessionTime;
//     app.limit = limit;
//     app.breakTime = breakTime;
//     app.lastUsed = new Date();
//   } else {
//     app = new Usage({
//       appName,
//       usedTime: sessionTime,
//       limit,
//       breakTime,
//     });
//   }

//   await app.save();
//   res.json(app);
// });

// // ➕ extend time
// router.post("/extend", async (req, res) => {
//   const { appName, extraTime } = req.body;

//   const app = await Usage.findOne({ appName });
//   if (!app) return res.status(404).json({ msg: "App not found" });

//   app.limit += extraTime;
//   app.extensions += 1;

//   await app.save();
//   res.json(app);
// });

// // 📊 get usage history
// router.get("/", async (req, res) => {
//   const data = await Usage.find();
//   res.json(data);
// });

// module.exports = router; // ✅ THIS WAS MISSING





const express = require("express");
const router = express.Router();
const Usage = require("../models/usage");

// SAVE / MERGE USAGE
router.post("/save", async (req, res) => {
  const { appName, sessionTime, limit, breakTime } = req.body;

  let app = await Usage.findOne({ appName });

  if (app) {
    app.usedTime += sessionTime;
    app.limit = limit;
    app.breakTime = breakTime;
    app.lastUsed = new Date();
  } else {
    app = new Usage({
      appName,
      usedTime: sessionTime,
      limit,
      breakTime,
    });
  }

  await app.save();
  res.json(app);
});

// EXTEND TIME
router.post("/extend", async (req, res) => {
  const { appName, extraTime } = req.body;

  const app = await Usage.findOne({ appName });
  if (!app) return res.status(404).json({ msg: "App not found" });

  app.limit += extraTime;
  app.extensions += 1;

  await app.save();
  res.json(app);
});

// GET HISTORY
router.get("/", async (req, res) => {
  const data = await Usage.find();
  res.json(data);
});

module.exports = router;
