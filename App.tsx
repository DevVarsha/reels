import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
//@ts-ignore
import Video, { OnProgressData } from 'react-native-video';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { videoArray, ArrayVideo } from "./ArrayData";


const { height, width } = Dimensions.get("window")

export default function App() {

  const videoRef = useRef<Video>(null)
  const [paused, setPaused] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [speackerShow, setSpeackerShow] = useState<boolean>(false)
  const [like, setLike] = useState<boolean>(false)


  useEffect(() => {

    if (currentIndex !== -1) {
      // videoRef.current.seek(0)
      setPaused(false)
      console.log("videoRef.current", currentIndex, currentTime)
    }
    if (isLoaded && currentIndex !== -1 && currentIndex > 0) {
      setIsLoaded(false)
    }
  }, [currentIndex, isLoaded])

  const onBuffer = (e: any) => {
    console.log("buffering....", e)
  }

  const videoError = (e: any) => {
    console.log("video error....", e)

  }


  const onProgress = (data: OnProgressData) => {

    setCurrentTime(data.currentTime);
  };

  function secondsToMinutesAndSeconds(seconds: number): { minutes: number; seconds: number } {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return { minutes, seconds: remainingSeconds };
  }

  const onLoad = (data: { duration: number }, index: number, currentIndex: number) => {
    if (!isLoaded && index !== currentIndex) {
      console.log("get onload data...", data.duration)
      const { minutes, seconds } = secondsToMinutesAndSeconds(data.duration);
      console.log(`Converted time: ${minutes} minutes and ${seconds} seconds`);
      setDuration(data.duration);
      setIsLoaded(true)
    }

  };

  const videoPlayer = (item: ArrayVideo, index: number) => {
    return (
      <Pressable
        onPress={() => {
          setIsMuted(!isMuted),
            setSpeackerShow(true)
          setTimeout(() => {
            setSpeackerShow(false)
          }, 1000)
        }}
        style={{
          height: height,
          width: width
        }}>
        <Video source={{ uri: item.sources }}
          ref={videoRef}
          onBuffer={onBuffer}
          onError={videoError}
          resizeMode="cover"
          paused={index !== currentIndex || paused}
          onProgress={onProgress}
          muted={isMuted}
          onLoad={(data: { duration: number }) => onLoad(data, index, currentIndex)}
          style={styles.backgroundVideo} />
        <View style={{ position: "absolute", bottom: 50, right: 6 }}>
          <TouchableOpacity
            onPress={() => setLike(!like)}
          >{
              like ?
                <Image style={[styles.icon3, { tintColor: "red" }]} source={require("./assets/heartfill.png")} />
                :
                <Image style={styles.icon3} source={require("./assets/heart.png")} />

            }
          </TouchableOpacity>
          <Text style={styles.countLike}>449 k</Text>
          <Image style={styles.icon2} source={require("./assets/message.png")} />
          <Text style={styles.countLike}>2,168</Text>
          <Image style={styles.icon2} source={require("./assets/paperplane.png")} />
          <Text style={styles.countLike}>191 k</Text>
          <Image style={styles.icon1} source={require("./assets/ellipsis.png")} />

        </View>

        <View style={{ position: "absolute", bottom: 30 }}
        >
<View style={styles.nameRow}>
<Image style={styles.profile} source={require("./assets/profile.jpeg")} />
<Text style={styles.tittle}>{item.title}</Text>
<TouchableOpacity style={styles.followBtn}>
  <Text style={[styles.tittle, {marginLeft:0}]}>Follow</Text>
</TouchableOpacity>
</View>

<Text numberOfLines={1}
style={styles.discription}
>{item.description}</Text>
             
        </View>
        {speackerShow && <View style={styles.imagView}>
          {
            isMuted ?
              <Image style={styles.speacker} source={require("./assets/speackerOff.png")} />
              :
              <Image style={styles.speacker} source={require("./assets/speackerOn.png")} />
          }
        </View>}
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <SwiperFlatList
        index={currentIndex}
        vertical
        data={videoArray}
        onChangeIndex={({ index }) => {
          setCurrentIndex(index)
          // console.log("get the index...", index)
        }}
        renderItem={({ item, index }) => videoPlayer(item, index)}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  backgroundVideo: {
    height: height,
    width: width
  },
  progressContainer: {
    height: 2,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
    borderColor: "#f9f9f9",
    width: width
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'blue',
  },
  imagView: {
    justifyContent: "center",
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    top: 0,
  },
  speacker: {
    height: 50,
    width: 50,
  },
  icon1: {
    height: 6,
    width: 30,
    marginTop:40
  },
  icon2: {
    height: 26,
    width: 26,
  },
  icon3: {
    height: 26,
    width: 26,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems:'center',
    marginLeft:16,
  },
  profile: {
    width:40,
    height:40,
    borderRadius:20
  },
  tittle:{
    color:"#fff",
    fontSize:14,
    marginLeft:10,
    fontWeight:"700"
  },
  followBtn: {
    borderRadius:4,
    borderColor: "#f9f9f9",
    borderWidth:0.5,
    marginLeft:10,
    paddingVertical: 4,
    paddingHorizontal:8
  },
  discription:{
    marginRight:60,
    marginLeft:20,
    marginTop:10,
    color:"#fff"
  },
  countLike: {
    color:"#fff",
    marginTop:8,
    marginBottom:20
  }
});