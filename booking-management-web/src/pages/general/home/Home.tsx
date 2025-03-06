import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import Navbar from "../../../components/Navbar/Navbar";

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx("home-container")}>
      <Navbar />
    </div>
  );
}

export default Home;
