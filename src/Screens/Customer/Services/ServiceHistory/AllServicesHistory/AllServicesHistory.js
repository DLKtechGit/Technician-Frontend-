import React, { useState, useEffect, useMemo } from "react";
import { connect, useSelector } from 'react-redux';
import { setFilteredData } from '../../../../../Redux/Action/Action'; // Update path to your actions
import Menus from "../../../Home/Menus/Menus";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Heading } from "../../../../../Reusable/Headings/Heading";
import { IoIosArrowBack } from "react-icons/io";
import { DatePicker, Space, Select } from "antd";
import ApiService from "../../../../../Services/TaskServices";
import moment from "moment";

const { Option } = Select;

const AllServicesHistory = ({ setFilteredData }) => {
  const location = useLocation();
  const userData = useSelector((state) => state.user.userData);
  const userID = useMemo(() => (userData ? userData._id : ""), [userData]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (userID) {
      getAllTasks();
    }
  }, [userID]);

  const getAllTasks = async () => {
    try {
      const allTasksResponse = await ApiService.TaskList();
      const allTasks = allTasksResponse.data.Results;
      const technicianTasks = allTasks.filter((task) => task.customerId === userID);
      const taskData = technicianTasks.flatMap((item) => item.technicians.map((technician) => technician.tasks));
      const customerTasks = taskData.flatMap((tasks) => {
        return tasks
      });
      // customerTasks && customerTasks.map((data) => {
      //   console.log("customerTasks",data.QrCodeCategory);
      // })
      setData(customerTasks);
      setFilteredData(customerTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  const onBack = () => {
    navigate("/home");
  };

  const onChangeMonth = (date, dateString) => {
    if (date) {
      setSelectedMonth(date.month() + 1);
    } else {
      setSelectedMonth(null);
    }
  };

  const onChangeStatus = (value) => {
    setSelectedStatus(value === "All" ? null : value);
  };

  const filteredData = data.filter((entry) => {
    const entryMonth = moment(entry.startDate).month() + 1;
    return (
      (selectedMonth === null || entryMonth === selectedMonth) &&
      (selectedStatus === null || entry.status === selectedStatus)
    );
  });

  const onFinish = (taskId) => {
    console.log("taskId",taskId);
    navigate("/specificHistory", { state: { taskId } });
  };

  return (
    <div className="">
      <Menus title="All Services" />
      <div className="d-flex flex-column">
        <div className="d-flex flex-row">
          <div className="col-2">
            <IoIosArrowBack className="backArrow" onClick={onBack} />
          </div>
          <div className="col-8 d-flex justify-content-center mt-1">
            <Heading heading="All Services History" />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end p-3">
        <Space direction="vertical">
          <DatePicker onChange={onChangeMonth} picker="month" />
          <Select
            placeholder="Select Status"
            style={{ width: 150 }}
            onChange={onChangeStatus}
          >
            <Option value="All">All</Option>
            <Option value="Yet to Start">Yet to Start</Option>
            <Option value="ongoing">Ongoing</Option>
            <Option value="completed">Completed</Option>
            {/* Add other status options as needed */}
          </Select>
        </Space>
      </div>
      <div className="p-3">
        {filteredData.length === 0 ? (
          <div>No service history found</div>
        ) : (
          filteredData.map((entry, index) => {
            const QrCodeCategory = entry.QrCodeCategory
            // console.log("entry",entry);
            return (
              <div
                key={index}
                className="card d-flex flex-column serviceHistoryCard mb-3"
              >
                <div className="d-flex justify-content-end p-2">
                  <FaRegCalendarAlt className="calendarIcon" />
                  <div className="ServiceHistoryDate px-2">
                    {moment(entry.startDate).format("DD-MM-YYYY")}
                  </div>
                  <div className="ServiceHistoryStatus px-2">
                    {entry.status}
                  </div>
                </div>
                <hr style={{ margin: "0px" }} />
                <div className="col-9 mt-2 p-1 mb-2">
                  {
                    QrCodeCategory && QrCodeCategory.length > 0 && (
                      QrCodeCategory.map((serviceName, index) => {
                        const category = serviceName.category;
                        return (
                          <div key={index} className="mb-2 padding1 px-4">
                            <div>
                              <div className="fonts13 textLeft" style={{ fontWeight: "700" }}>
                                {category} :
                              </div>
                              {serviceName.subCategory.map((subItem, subIndex) => (
                                <div key={subIndex} className="mt-1 d-flex flex-row justify-content-between align-items-center">
                                  <div className="d-flex align-items-center fonts13 textLeft px-2">
                                    {subIndex + 1}. {subItem}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )
                  }

                </div>
                <div className="col-12 d-flex align-items-center justify-content-center mb-3">
                  <div style={{ fontSize: "12px" }} className="col-12 d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn pestBtn"
                      onClick={() => onFinish(entry._id)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFilteredData: (filteredData) => dispatch(setFilteredData(filteredData)),
  };
};

export default connect(null, mapDispatchToProps)(AllServicesHistory);
