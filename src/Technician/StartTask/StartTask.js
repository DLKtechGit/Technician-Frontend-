import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Model from "../../Reusable/Model";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import clock from "../../Assets/Images/icons8-clock-100.png";
import { useNavigate } from "react-router-dom";
import ApiService from "../../Services/TaskServices";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import moment from "moment";
import Loader from "../../Reusable/Loader";

const StartTask = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const technicianStartTime = location.state?.technicianStartTime;
  const technicianStartDate = location.state?.technicianStartDate;
  const serviceNames = location.state?.serviceName;
  const finialTitleData = location.state?.finialTitleData;
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(true);
  const [pauseReason, setPauseReason] = useState("");
  const [stopTask, setStopTask] = useState(false);
  const [showPauseReasonModal, setShowPauseReasonModal] = useState(false);
  const [taskId, setTaskID] = useState("");
  const [qrStatusId, setqrcodeStatusId] = useState([]);
  const [taskItemId, setTaskItemID] = useState("");
  const [serviceName, setServiceName] = useState([]);
  const [title, setTitle] = useState();
  const [maincategory, setMaincategory] = useState();
  const [subCatName, setSubCatNames] = useState([]);
  const [qrId, setQrId] = useState([]);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [resumeTime, setResumeTime] = useState(null);
  const [pauseTiming, setPauseDuration] = useState("");
  const [getData, setGetdata] = useState([]);
  const [service1, setService1] = useState(false);
  const [rodent, setRodent] = useState(false);
  const [service2, setService2] = useState(false);
  const [subCatId, setSubcatId] = useState("");
  const [rodentSubID, setRodentSubId] = useState("");
  const [loader, setLoader] = useState(false);
  let navigate = useNavigate()

  // useEffect(() => {
  //   // Prevent going back to the previous page
  //   const handlePopState = (event) => {
  //     if (location.pathname === '/start/task') {
  //       event.preventDefault();
  //       window.history.pushState(null, null, window.location.href);
  //     }
  //   };

  //   // Prevent page reload
  //   const handleBeforeUnload = (event) => {
  //     if (location.pathname === '/start/task') {
  //       event.preventDefault();
  //       event.returnValue = ''; // Chrome requires returnValue to be set
  //     }
  //   };

  //   if (location.pathname === '/start/task') {
  //     window.history.pushState(null, null, window.location.href);
  //     window.addEventListener('popstate', handlePopState);
  //     window.addEventListener('beforeunload', handleBeforeUnload);
  //   }

  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [location.pathname]);

  
  const selectedTaskIDData = useSelector(
    (state) => state?.task?.task?.selectedTaskId
  );
  const selectedTaskData = useSelector(
    (state) => state?.task?.task?.selectedTask
  );
  const cat = useSelector((state) => state.CategoryReducer.category);

  console.log(location.state.subCatId);

  useEffect(() => {
    const rodentid = location.state.subCatId;
    console.log("id", rodentid);
    setRodentSubId(rodentid);
  }, [location]);

  console.log("rodendtid", rodentSubID);

  useEffect(() => {
    setTaskItemID(selectedTaskData?._id);
  }, [selectedTaskData]);
  const selectedTaskDetailData = useSelector(
    (state) => state?.task?.task?.selectedTask
  );

  useEffect(() => {
    const subid = location?.state?.subid;
    // console.log('subid',subid);
    setSubcatId(subid);
  }, [location]);

  console.log("subCatId", subCatId);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoader(true);
    try {
      const getdata = await getAllTasksData(selectedTaskDetailData?._id);
      console.log("getdata", getdata);
      if (getdata) {
        setTaskItemID(getdata?._id);
        setTaskID(selectedTaskIDData);
        setGetdata(getdata);
        const serviceName = getdata?.serviceName;
        setSubCatNames(serviceName);
        console.log("subname", subCatName);
        let arr = [];
        let foundQrId = false;
        getdata?.qrDetails?.forEach((data) => {
          const dataTitles = data.titles;
          console.log("titeleleeee", dataTitles);
          if (cat === data.serviceName) {
            dataTitles &&
              dataTitles.forEach((item) => {
                if (finialTitleData === item.title) {
                  setQrId(item._id);
                  foundQrId = true;
                  console.log("item", item);

                  console.log("item", item);
                  if (finialTitleData === item.title) {
                    setQrId(item._id);
                    foundQrId = true;
                  }
                  if (item.qrScanned === true) {
                    const titledata = item?.title;
                    arr.push(titledata);
                  }
                }
              });
          }
        });
        setTitle(arr);

        if (!foundQrId) {
          setQrId(null);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };

  const finalpauseTimer = () => {
    if (pauseReason.trim() === "") {
      toast.warning("Please enter a reason for pause");
    } else {
      setShowPauseReasonModal(false);
      pauseconfirm();
    }
  };

  // const setPauseReasons  = async()=>{
  //   try {
  //    const response = await ApiService.UpdatePauseReason({
  // taskItemId,
  // taskId,
  // subCatId,
  // pauseReason,
  // pauseDuration
  //    })
  //    if (response && response.status === 200) {
  //     toast.success("Pause Reason Submitted successfully");
  //     setShowPauseReasonModal(false);
  //     setPauseReason('')

  //     pauseconfirm();
  //   } else {
  //     console.error(
  //       `Error: Pause Reason Submitted Failed. Status code: ${response ? response.status : "unknown"
  //       }`
  //     );
  //   }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const getAllTasksData = async (id) => {
    setLoader(true);
    try {
      const response = await ApiService.GetTaskStatus(id);
      return response?.data?.selectedTask;
    } catch (error) {
      console.error("Unable to start the task:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    setTaskID(selectedTaskIDData);
  }, [selectedTaskIDData]);
  useEffect(() => {
    const servicenames = selectedTaskData.serviceName;
    const mainCategory = selectedTaskData.qrDetails.map((data) => {
      return data.serviceName;
    });
    setMaincategory(mainCategory);
    setServiceName(servicenames);
  }, [selectedTaskData]);
 
  const handleShow = () => {
    setShowPauseReasonModal(true);
  };
  const handleClose = () => {
    setShowPauseReasonModal(false);
    setIsRunning(true);
  };
  const handleStop = async () => {
    setLoader(true)
    try {
      
    
    
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    const Generalresponse = await ApiService.GetGeneralFalseStatus({
      taskItemId,
    });
    const GeneralTrueresponse = await ApiService.GetGeneraltrueStatus({
      taskItemId,
    });
    const selectedTaskData = await getAllTasksData(taskItemId);
    const RodentSkipResponse = await ApiService.GetRodentSkipStatusfalse({
      taskItemId,
    });
    const rodentSkipLng = RodentSkipResponse?.data?.qrDetails?.length;
    await ApiService.UpdateSubCategoryStatus({
      taskId,
      taskItemId,
      status: true,
      subcatId: subCatId ? subCatId : rodentSubID,
    });
    if (
      (!selectedTaskData?.Rodentstatus &&
        location.state?.serviceName == "Rodent Pro") ||
      (rodentSkipLng > 0 && location.state?.serviceName == "Rodent Pro")
    ) {
      navigate("/taskdetails", {
        state: { taskId: selectedTaskDetailData?._id, _id: rodentSubID },
      });
    } else if (
      Generalresponse.data?.subCategoryStatusWithFalseStatus?.length > 1
    ) {
      navigate("/tech/home", { state: { status: "Ongoing" } });
    } else if (
      !selectedTaskData?.Rodentstatus &&
      selectedTaskData?.QrCodeCategory?.length == 2 &&
      location.state?.serviceName != "Rodent Pro"
    ) {
      navigate("/tech/home", { state: { status: "Ongoing" } });
    } else if (
      selectedTaskData?.Rodentstatus &&
      selectedTaskData?.QrCodeCategory?.length == 2 &&
      GeneralTrueresponse.data?.subCategoryStatusWithFalseStatus?.length == 0 &&
      location.state?.serviceName == "Rodent Pro"
    ) {
      navigate("/tech/home", { state: { status: "Ongoing" } });
    } else if (
      !selectedTaskData?.Rodentstatus &&
      selectedTaskData?.QrCodeCategory?.length == 2 &&
      GeneralTrueresponse.data?.subCategoryStatusWithFalseStatus?.length > 0 &&
      location.state?.serviceName != "Rodent Pro"
    ) {
      navigate("/tech/home", { state: { status: "Ongoing" } });
    } else {
      navigate("/chemical/list");
    }
  } catch (error) {
      console.log(error);
  }
  finally{
    setLoader(false)
  }
    
  };

  useEffect(() => {
    const suball = getData.QrCodeCategory;

    // console.log('suball',suball);

    suball &&
      suball.map((it) => {
        console.log("dddd", it);
        const subsId = it;
        setqrcodeStatusId(subsId);
        // console.log('subcatstats',qrStatusId);
      });

    // const subcatstats = qrStatusId.subCategoryStatus;
    // // console.log('subcatstats',subcatstats);

    // subcatstats &&
    //   subcatstats.map((item) => {
    //     const subcatstatsId = item._id;
    //     console.log("subcatstatsId", subcatstatsId);
    //     setSubcatId(subcatstatsId);
    //   });
  }, [getData]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newSeconds = prevTime.seconds + 1;
          const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
          const newHours = prevTime.hours + Math.floor(newMinutes / 60);
          return {
            hours: newHours,
            minutes: newMinutes % 60,
            seconds: newSeconds % 60,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
  const pauseTimer = () => {
    setIsRunning(true);
    handleShow();
  };
  const pauseconfirm = () => {
    const pausetimes = new Date();
    setPauseStartTime(pausetimes);
    setIsRunning(false);
  };
  // const resumeTimer = () => {
  // const resumeTimes = new Date();
  // setResumeTime(moment(resumeTimes));
  // setIsRunning(true);
  // if (pauseStartTime !== null) {
  //   const duration = moment.duration(resumeTimes - pauseStartTime);
  //   const hours = Math.floor(duration.asHours());
  //   const minutes = duration.minutes();
  //   const seconds = duration.seconds();
  //   if(pauseDuration!=='')
  //   setPauseDuration(`${hours}:${minutes}:${seconds}`);

  // }
  // PauseDurationtimes()
  // };

  const PauseDurationtimes = async () => {
    setLoader(true);
    const resumeTimes = new Date();
    // setResumeTime(moment(resumeTimes));
    const duration = moment.duration(resumeTimes - pauseStartTime);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const alldata = `${hours}:${minutes}:${seconds}`;
    // setPauseDuration(`${hours}:${minutes}:${seconds}`);

    try {
      const response = await ApiService.UpdatePauseReason({
        taskItemId,
        taskId,
        subCatId: subCatId ? subCatId : rodentSubID,
        pauseReason,
        pauseTiming: alldata,
      });
      if (response && response.status === 200) {
        // toast.success("Pause Time Submitted successfully");
        // setShowPauseReasonModal(false);
        // setPauseReason('')
        setIsRunning(true);
        setPauseReason("");
        // pauseconfirm();
        console.log("success");
      } else {
        console.error(
          `Error: Pause Reason Submitted Failed. Status code: ${
            response ? response.status : "unknown"
          }`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  // const handlepause = async () => {
  //   try {
  //     const response = await ApiService.UpdateStatus({
  //       taskId: taskId,
  //       taskItemId: taskItemId,
  //       status: "ongoing",
  //       pauseReason: pauseReason,
  //       technicianStartDate: technicianStartDate,
  //       technicianStartTime: technicianStartTime,
  //       qrScanned: "true",
  //       // qrId:
  //     });
  //     // console.log("response", response);
  //     if (response && response.status === 200) {
  //       toast.success("Pause Reason Submitted successfully");
  //       setShowPauseReasonModal(false);
  //       pauseconfirm();
  //     } else {
  //       console.error(
  //         `Error: Pause Reason Submitted Failed. Status code: ${response ? response.status : "unknown"
  //         }`
  //       );
  //     }
  //   } catch (error) {
  //     getData.noqrcodeService && getData.noqrcodeService.map(async (item) => {
  //       // console.log("nosubcatIddata", item);
  //       if (serviceNames === item.subCategory) {
  //         await ApiService.UpdateNoQRSubCategoryStatus({
  //           taskId: taskId,
  //           taskItemId: taskItemId,
  //           status: true,
  //           nosubcatId: item._id
  //         });
  //         const response = await ApiService.GetNoSubCategoryFalseStatus();
  //         if (response.data?.NosubCategoryStatusWithFalseStatus) {
  //           navigate('/tech/home', { state: { status: "Ongoing" } });
  //         } else {
  //           navigate("/chemical/list", { state: { technicianStartDate, technicianStartTime, pauseReason } });
  //         }
  //       }
  //     })
  //   }
  // };



  return (
    <div>
      {loader && <Loader show={loader} />}

      <Menus />
      <div className="d-flex justify-content-center align-items-center flex-column mt-4">
        <div
          className="m-2 p-2"
          style={{
            backgroundColor: "rgb(159 221 90 / 20%)",
            borderRadius: "0px",
          }}
        >
          <p className="fonts12 mt-2">
            {" "}
            🕒 NOTE: Work has commenced and the timer is now running. Once the
            task is completed, kindly hit the stop button. Thank you!
          </p>
        </div>
        <div className="mt-3">
          <table>
            <tr>
              <td className="fonts12 " style={{ textAlign: "left" }}>
                <span style={{ fontWeight: "bold" }}>
                  Customer Name&nbsp; -{" "}
                </span>
                <span>&nbsp; {selectedTaskData.companyName}</span>
              </td>
            </tr>
            <tr>
              <td className="fonts12 " style={{ textAlign: "left" }}>
                <span style={{ fontWeight: "bold" }}>
                  Service Name&nbsp; -{" "}
                </span>
                {serviceNames}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center gap-4 align-items-center mt-4 mb-5">
        <div
          className="bf d-flex flex-column justify-content-center align-items-center gap-3 "
          style={{
            backgroundColor: "rgb(159 221 90 / 42%)",
            width: "300px",
            height: "350px",
            borderRadius: "30px",
          }}
        >
          <div className="d-flex flex-column justify-content-center align-items-center gap-2">
            <h2>Timer</h2>
            <img src={clock} alt="clock" />
          </div>
          <div>
            <h1>
              {formatTime(time.hours)}:{formatTime(time.minutes)}:
              {formatTime(time.seconds)}
            </h1>
          </div>
          <div className="d-flex gap-4">
            {isRunning ? (
              <>
                <button className="btn btn-danger" onClick={pauseTimer}>
                  Pause
                </button>
                <button className="btn btn-primary ml-2" onClick={handleStop}>
                  Stop
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={PauseDurationtimes}>
                Resume
              </button>
            )}
          </div>
        </div>
      </div>
      <Model
        show={showPauseReasonModal}
        modalTitle="Pause Reason"
        modalContent={
          <textarea
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
            style={{ border: "1px solid #d4cfcf" }}
            className="col-12"
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
            rows={5}
            placeholder="Enter reason for pause..."
          />
        }
        onClose={handleClose}
        onConfirm={finalpauseTimer}
      />
      <ToastContainer />
    </div>
  );
};
export default StartTask;
