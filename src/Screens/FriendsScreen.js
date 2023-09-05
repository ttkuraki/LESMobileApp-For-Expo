import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Button, ImageBackground, SectionList, Text, View } from "react-native";
//dummy data
import { FriendButton } from "../Components/FriendButton";
import { FriendList } from "../Components/FriendList";
import FriendListChatButton from "../Components/FriendListChatButton";
import { RecomFriendsData } from "../Data/dummyData";
import DataCenter from "../modules/DataCenter";
import { DataEvents, UIEvents } from "../modules/Events";
import FriendService from "../services/FriendService";
import NotificationService from "../services/NotificationService";
import JSEvent from "../utils/JSEvent";
import { LesConstants } from "les-im-components";

const friendButtonContent = [
  { title: "Friends Request", icon: "emoji-people", link: "" },
  { title: "Blocked", icon: "block", link: "" },
];

const RecommendedFriend = (id, name, avatar) => (
  <View className="flex-row justify-between mb-[10px]">
    <View className="flex-row items-center">
      <View className="w-[55px] h-[55px] rounded-full overflow-hidden mr-[10px]">
        <ImageBackground
          source={{ uri: avatar }}
          className="w-[100%] h-[100%]"
        />
      </View>
      <Text className="text-white text-[20px] font-bold">{name}</Text>
    </View>
    <View className="flex-row items-center">
      <View className="w-[35px] h-[35px] bg-[#182634] rounded-full overflow-hidden justify-center items-center mr-[10px]">
        <Ionicons name="close" color={"white"} size={24} />
      </View>
      <View className="w-[35px] h-[35px] bg-[#182634] rounded-full overflow-hidden justify-center items-center">
        <Ionicons name="add-outline" color={"white"} size={24} />
      </View>
    </View>
  </View>
);

export default function FriendsScreen() {
  // const [onlineFriends, setOnlineFriends] = useState([]);
  // const [offlineFriends, setOfflineFriends] = useState([]);
  const [friendsData, setFriendsData] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  // 可传参数 { id, state, onlineState }
  const onFriendStateUIUpdated = async () => {
    // const online = FriendService.Inst.getFriendList((f) => f.isOnline);
    // const offline = FriendService.Inst.getFriendList((f) => !f.isOnline);
    const friendList = await FriendService.Inst.getFriendList();
    console.log("friend list: ", friendList);
    const online = friendList.filter(
      (item) => item.onlineState === LesConstants.IMUserOnlineState.Online
    );
    const offline = friendList.filter(
      (item) => item.onlineState !== LesConstants.IMUserOnlineState.Online
    );

    setFriendsData([
      // { title: "Recommended Friends", data: [] },
      { title: "Online", data: online },
      { title: "Offline", data: offline },
    ]);
  };

  const updateUnreadCountHandler = () => {
    const count = DataCenter.notifications.unreadCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    const initFriendScreen = () => {
      onFriendStateUIUpdated();

      updateUnreadCountHandler();
    };

    initFriendScreen();

    JSEvent.on(UIEvents.User.UserState_UIRefresh, onFriendStateUIUpdated);
    JSEvent.on(
      DataEvents.Notification.NotificationState_Updated,
      updateUnreadCountHandler
    );
    JSEvent.on(UIEvents.User.UserState_IsLoggedin, initFriendScreen);

    return () => {
      JSEvent.remove(UIEvents.User.UserState_UIRefresh, onFriendStateUIUpdated);
      JSEvent.remove(
        DataEvents.Notification.NotificationState_Updated,
        updateUnreadCountHandler
      );
      JSEvent.remove(UIEvents.User.UserState_IsLoggedin, initFriendScreen);
    };
  }, []);

  const temporyAddHander = () => {
    // LesPlatformCenter.IMFunctions.sendFriendInvitation(8)
    NotificationService.Inst.sendFriendInvitation(40)
      .then((res) => {
        console.log("Inivitation success: ", res);
      })
      .catch((e) => console.log("Invitiation failed: ", e));
  };

  const TemporyAddButton = () => (
    <Button title="Add" onPress={temporyAddHander} />
  );

  return (
    <View className="flex-1 px-[5vw]">
      <TemporyAddButton />
      <View>
        {/* {friendButtonContent.map(({ title, icon, link }, index) => (
          <FriendButton title={title} icon={icon} link={link} index={index} />
        ))} */}
        <FriendButton
          title="Friend Request"
          icon="emoji-people"
          link="FriendRequest"
        >
          {unreadCount !== 0 && (
            <View className="w-[20px] h-[20px] bg-[#FF3737] rounded-full relative bottom-[15px] right-[5px]">
              <Text className="font-bold text-white text-center">
                {unreadCount}
              </Text>
            </View>
          )}
        </FriendButton>
        <FriendButton title="Blocked" icon="block" link="Blocked" />
      </View>
      <View className="mt-[30px] flex-1">
        {/* <Text className="text-white font-bold text-[24px]">
          Recommended Friends
        </Text> */}
        <View className="flex-1">
          <SectionList
            stickySectionHeadersEnabled={false}
            sections={friendsData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item, section }) =>
              section.title === "Recommended Friends" ? (
                <RecomFriendsData
                  id={item.id}
                  name={item.name}
                  state={item.state}
                  avatar={item.avatar}
                />
              ) : (
                <FriendList
                  friend={item}
                  button={<FriendListChatButton friend={item} />}
                />
              )
            }
            renderSectionHeader={({ section: { title } }) => (
              <Text className="text-white font-bold text-[24px] my-[10px]">
                {title}
              </Text>
            )}
          />
        </View>
      </View>
    </View>
  );
}
