import Settings from "./Settings";
import Recordings from "./Recordings";
import Transcriptions from "./transcriptions/index";
import Workflow from "./workflow/index";
import Header from './Header'
import { constants } from "utils";

const RightSideBar = ({selectedItem}) => {
    return (
        <div className="flex flex-col flex-1">
    <span>
        {" "}
        <Header selectedItem={selectedItem} />
      </span>
      {selectedItem === constants.SIDEBAR_RECORDINGS && <Recordings />}
      {selectedItem === constants.SIDEBAR_TRANSCRIPTIONS && (
        <Transcriptions />
      )}
      {/* {selectedItem === constants.SIDEBAR_DASHBOARD && <ActivityDashBoard />} */}
      {/* {selectedItem === constants.SIDEBAR_REFER_AND_EARN && <ReferAndEarn />} */}
      {selectedItem === constants.SIDEBAR_SETTINGS && <Settings />}
      {selectedItem === constants.SIDEBAR_WORKFLOW && <Workflow />}
      </div>
      )
}
export default RightSideBar