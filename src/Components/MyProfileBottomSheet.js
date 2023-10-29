import CommonBottomSheetModal from "./CommonBottomSheetModal";
import UserBottomSheetHeader from "./UserBottomSheetHeader";
import Links from "./UserDrawer/Links";
import DataCenter from "../modules/DataCenter";
import { View } from "react-native";

const MyProfileBottomSheet = ({ visible, onClosed }) => {
  return (
    <CommonBottomSheetModal
      visible={visible}
      onClosed={onClosed}
      snapPoints={["85%"]}
      index={0}
    >
      <View className="flex-1">
        <UserBottomSheetHeader user={DataCenter.userInfo.imUserInfo} />
        <Links />
      </View>
    </CommonBottomSheetModal>
  );
};

export default MyProfileBottomSheet;
