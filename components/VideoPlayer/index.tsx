import React, { useCallback, useState } from "react";
import { View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function YoutubeVideoPlayer({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <View className="flex flex-col items-center bg-gray-200 h-[600px]">
      <View className="mt-4 h-[500px] flex items-center justify-end w-full bg-gray-200 rounded-lg">
        <YoutubePlayer
          height={400}
          width={800}
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
        />
      </View>
    </View>
  );
}