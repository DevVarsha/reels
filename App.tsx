import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native'
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


  useEffect(() => {

    if (currentIndex !== -1) {
      // videoRef.current.seek(0)
      setPaused(false)
      console.log("videoRef.current", currentIndex, currentTime)
    }
    if(isLoaded && currentIndex !== -1 && currentIndex > 0){
      Alert.alert("call")
      setIsLoaded(false)
    }
  }, [currentIndex,isLoaded])

  const onBuffer = (e: any) => {
    // console.log("buffering....", e)
  }

  const videoError = (e: any) => {
    // console.log("video error....", e)

  }
  const onPlayPausePress = () => {
    setPaused(!paused);
  };

  const onProgress = (data: OnProgressData) => {

    setCurrentTime(data.currentTime);
  };

  function secondsToMinutesAndSeconds(seconds: number): { minutes: number; seconds: number } {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return { minutes, seconds: remainingSeconds };
  }

  const onLoad = (data: { duration: number }, index:number, currentIndex:number) => {
    if (!isLoaded && index !== currentIndex) {
      console.log("get onload data...", data.duration)
      const { minutes, seconds } = secondsToMinutesAndSeconds(data.duration);
      console.log(`Converted time: ${minutes} minutes and ${seconds} seconds`);
      setDuration(data.duration);
      setIsLoaded(true)
    }

  };

  const calculateProgress = () => {
    if (duration !== undefined && duration !== 0) {
      return (currentTime / duration) * 100;
    }
    return 0;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  const videoPlayer = (item: ArrayVideo, index: number) => {
    return (
      <TouchableOpacity
      onPress={()=>setIsMuted(!isMuted)}
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
          onLoad={(data: {duration:number})=> onLoad(data,index, currentIndex)}
          style={styles.backgroundVideo} />

        <View style={{ position: "absolute", bottom: 30, left: 20, right: 20, }}
        >
          <View style={styles.progressContainer}>
            <View
              style={{ ...styles.progressBar, width: `${calculateProgress()}%` }}
            />
          </View>


          <TouchableOpacity
            onPress={onPlayPausePress}>
            <Text>{paused ? 'Play' : 'Pause'}</Text>
          </TouchableOpacity>

          <Text>
            Current Time: {formatTime(currentTime)} / Total Time:{' '}
            {duration !== undefined ? formatTime(duration) : 'Loading...'}
          </Text>
        </View>
        <View style={styles.imagView}>
      {
        isMuted ? 
        <Image style={styles.speacker} source={require("./assets/speackerOff.png")} />
        :
        <Image style={styles.speacker} source={require("./assets/speackerOn.png")} />
      }
      </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <SwiperFlatList
        // autoplay
        // autoplayDelay={20000}
        // autoplayLoop={false}
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
    height: 10,
    backgroundColor: '#ccc',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'blue',
  },
  imagView:{
   justifyContent:"center",
  //  position:"absolute"
  },
  speacker:{
    
    height:120,
    width:20
  }
});