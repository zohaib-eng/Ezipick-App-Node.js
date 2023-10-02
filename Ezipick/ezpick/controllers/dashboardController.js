// Package Imports

// Local Imports
const { ClientService } = require("../services");
const express = require("express");

module.exports = class {
  // dashBoard Api

  static async dashboard(req, res) {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;
    if (id && dateFrom && dateTo) {
      const data = await DashboardService.dashboard(
        "clientId",
        id,
        dateFrom,
        dateTo
      );
      if (data.error) {
        return res.status(200).json({ success: true, schools: [] });
      } else {
        return res.status(200).json({
          success: true,
          schools: data.result,
          grades: data.result1,
          teachers: data.result2,
          students: data.result3,
          parentsData: {
            parents: data.result4,
            androidDevices: data.result5,
            iphoneDevices: data.result6,
            emptydevice: data.result7,
          },
          totalRequest: {
            requests: data.result8,
            sentRequests: data.result9,
            approveRequests: data.result10,
            confirmRequests: data.result11,
          },
          Weekly_Requests: data.per_day,
        });
      }
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }

  static async clientDashboard(req, res) {
    const data1 = await ClientService.getAll();
    if (data1.error) {
      return res.status(200).json({ success: true, clients: [] });
    } else {
      let people = [];
      data1?.result?.map(async (item) => {
        const { dateFrom, dateTo } = req.query;
        if (item && dateFrom && dateTo) {
          const data = await DashboardService.dashboard(
            "clientId",
            item.id,
            dateFrom,
            dateTo
          );console.log(data.result);
          if (!data.error) {
            res.status(200).json({
              schools: data.result,
              grades: data.result,
              teachers: data.result,
              students: data.result,
              parentsData: {
                parents: data.result,
                androidDevices: data.result,
                iphoneDevices: data.result,
                emptydevice: data.result,
              },
              totalRequest: {
                requests: data.result,
                sentRequests: data.result,
                approveRequests: data.result,
                confirmRequests: data.result,
              },
              Weekly_Requests: data.result,
            });

            // if(person){
            // console.log(person, "jhbj");
            // people.push(person);
            // console.log(people, "poeple");
            // }
          }
        }
      });
      return res.json({ success: true, clients: people });
    }
  }
};
