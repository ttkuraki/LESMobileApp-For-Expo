import { View, Text, TouchableHighlight, ImageBackground } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { LesConstants } from "les-im-components";
import Avatar from "./Avatar";
import Constants from "../modules/Constants";

export const ChatList = ({
  curChatId,
  // chatId,
  // avatar,
  // targetId,
  chatListItem,
  chatListInfo,
  chatListNewMsgCount,
  onClickChatHandler,
}) => {
  const [newMsgCount, setNewMsgCount] = useState(0);

  useEffect(() => {
    const count =
      chatListNewMsgCount.find((item) => chatListItem?.chatId === item.chatId)
        ?.newMessageCount ?? 0;
    console.log("new msg count: ", count);
    setNewMsgCount(count);
  }, [chatListNewMsgCount]);

  const info = chatListInfo.find((item) => item.id === chatListItem.targetId);

  const tag =
    info?.type === Constants.ChatListType.Group ? info?.id : info?.tag;

  const name = info?.name;

  // console.log("ssss: ", chatListInfo, info, tag, name);
  // const info = chatListInfo.find((item) => item.id === chatListItem.targetId);
  // const tag = info?.type === Constants.ChatListType.Group ? info.id : info.tag;
  // const name = info.name;
  // console.log("ssss: ", chatListInfo, info, tag, name);

  return (
    // add onPress handler to switch chat recipient
    <TouchableHighlight
      onPress={() =>
        onClickChatHandler({
          chatListItem,
        })
      }
      // onPress={() => console.log(targetId)}
    >
      <View className="relative">
        <View
          className={
            curChatId === chatListItem?.chatId
              ? "border-[#5EB857] border-4 rounded-full w-[55px] h-[55px] mb-[15px] relative"
              : "rounded-full w-[55px] h-[55px] mb-[15px]"
          }
        >
          <Avatar tag={tag} name={name} />

          {info?.type === Constants.ChatListType.Group && (
            <View className="w-[20px] h-[20px] rounded-md bg-[#6E5EDB] absolute right-0 justify-center items-center">
              <Text className="text-white">G</Text>
            </View>
          )}
        </View>
        {chatListItem?.chatId !== curChatId && newMsgCount !== 0 && (
          <View className="absolute bottom-[10] right-[0] rounded-full w-[20px] h-[20px] bg-[#FF3737] justify-center items-center">
            <Text className="text-white font-bold text-[12px]">
              {newMsgCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};
