//play
export const play = async (playbackObj, uri) => {
  try {
    const status = await playbackObj.loadAsync({ uri }, { shouldPlay: true });
    return status;
  } catch (error) {
    console.log("Error in play() : ", error.message);
  }
};
//pause

export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("Error in pause():", error.message);
  }
};

//resume

export const resume = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: true,
    });
  } catch (error) {
    console.log("Error in resume():", error.message);
  }
};

//select another audio

export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("Error in playNext():", error.message);
  }
};
