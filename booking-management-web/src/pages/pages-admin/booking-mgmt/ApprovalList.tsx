import classNames from "classnames/bind";
import styles from "./ApprovalList.module.scss";
import CardApproval from "../../../components/cardApproval/CardApproval";
import { useEffect, useState } from "react";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import axios from "axios";

const cx = classNames.bind(styles);

function ApprovalList() {
  return (
    <div>
      <h1>Approval List</h1>
    </div>
  );
}

export default ApprovalList;
