import React from "react";
import ChatBox from "./chatbox";

const MemoizedChatPanel = React.memo(({ context, chatState, setChatState, onChartUpdate }) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ChatBox
        context={context}
        chatState={chatState}
        setChatState={setChatState}
        onChartUpdate={onChartUpdate}
      />
    </div>
  );
});

export default MemoizedChatPanel;